import { NextResponse } from "next/server";
import { readDB, writeDB, OrderStatus } from "@/lib/db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { nextStatus, cancelReason, requestedByRole, studentId } = body;

    const db = readDB();
    const orderIndex = db.orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const currentOrder = db.orders[orderIndex];

    // CANCELLATION LOGIC
    if (nextStatus === "cancelled") {
      // If student is requesting cancellation:
      if (requestedByRole === "student") {
        if (studentId && currentOrder.studentId !== studentId) {
          return NextResponse.json(
            { success: false, message: "Unauthorized. You can only cancel your own orders." },
            { status: 403 }
          );
        }

        // Rule: Can only cancel if status is "pending"!
        if (currentOrder.status !== "pending") {
          return NextResponse.json(
            {
              success: false,
              message: `Order cannot be cancelled because the kitchen has already marked it as '${currentOrder.status.toUpperCase()}'.`,
            },
            { status: 400 }
          );
        }
      }

      // If already cancelled or completed
      if (currentOrder.status === "cancelled" || currentOrder.status === "completed") {
        return NextResponse.json(
          {
            success: false,
            message: `Order is already marked as ${currentOrder.status}.`,
          },
          { status: 400 }
        );
      }

      // If paid via wallet, issue immediate refund to student's balance!
      if (currentOrder.paymentMethod === "wallet" && currentOrder.paymentStatus === "paid") {
        const userIndex = db.users.findIndex(
          (u) =>
            u.studentId === currentOrder.studentId ||
            u.email.toLowerCase() === currentOrder.studentEmail.toLowerCase()
        );
        if (userIndex !== -1) {
          db.users[userIndex].walletBalance += currentOrder.totalAmount;
        }
      }

      // Restore inventory
      for (const item of currentOrder.items) {
        const dbItem = db.menuItems.find((m) => m.id === item.menuItemId);
        if (dbItem && dbItem.inventoryItemId) {
          const inv = db.inventory.find((i) => i.id === dbItem.inventoryItemId);
          if (inv) {
            inv.currentStock += item.quantity;
          }
        }
      }

      db.orders[orderIndex].status = "cancelled";
      db.orders[orderIndex].cancelReason = cancelReason || "Cancelled by user";
      db.orders[orderIndex].updatedAt = new Date().toISOString();

      writeDB(db);

      return NextResponse.json({
        success: true,
        message: "Order has been cancelled and wallet balance refunded (if applicable).",
        order: db.orders[orderIndex],
      });
    }

    // STAFF / ADMIN STATUS TRANSITION WORKFLOW
    // Allowed transitions:
    // pending -> accepted
    // accepted -> preparing
    // preparing -> ready
    // ready -> completed
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ["accepted", "cancelled"],
      accepted: ["preparing", "cancelled"],
      preparing: ["ready", "cancelled"],
      ready: ["completed"],
      completed: [],
      cancelled: [],
    };

    const targetStatus = nextStatus as OrderStatus;

    if (!validTransitions[currentOrder.status]?.includes(targetStatus)) {
      // If admin, allow manual override, but if staff, enforce lifecycle
      if (requestedByRole !== "admin") {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot transition order directly from '${currentOrder.status}' to '${targetStatus}'.`,
          },
          { status: 400 }
        );
      }
    }

    db.orders[orderIndex].status = targetStatus;
    db.orders[orderIndex].updatedAt = new Date().toISOString();

    // If marked completed and was cash at counter, mark payment completed
    if (targetStatus === "completed" && db.orders[orderIndex].paymentMethod === "cash_at_counter") {
      db.orders[orderIndex].paymentStatus = "paid";
    }

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: `Order #${currentOrder.tokenNumber} status updated to ${targetStatus}.`,
      order: db.orders[orderIndex],
    });
  } catch (error) {
    console.error("Orders PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error while updating order." },
      { status: 500 }
    );
  }
}
