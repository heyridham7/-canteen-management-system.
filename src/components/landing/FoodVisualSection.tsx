"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Clock,
  Star,
  Plus,
  UtensilsCrossed,
  Sparkles,
  Coffee,
  Sandwich,
  Pizza,
  Soup,
  Check,
} from "lucide-react";

interface Dish {
  id: string;
  name: string;
  category: "all" | "meals" | "breakfast" | "snacks" | "beverages";
  categoryLabel: string;
  price: string;
  prepTime: string;
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  calories: string;
  description: string;
  popular?: boolean;
}

const SAMPLE_DISHES: Dish[] = [
  {
    id: "f1",
    name: "Classic Paneer Kathi Roll",
    category: "snacks",
    categoryLabel: "Quick Snacks",
    price: "₹80",
    prepTime: "6 mins",
    rating: 4.8,
    reviewCount: 142,
    isVeg: true,
    calories: "320 kcal",
    description: "Char-grilled cottage cheese tossed with spiced peppers, crunchy onions, and mint chutney wrapped in a flaky paratha.",
    popular: true,
  },
  {
    id: "f2",
    name: "Executive South Indian Thali",
    category: "meals",
    categoryLabel: "Meals",
    price: "₹110",
    prepTime: "8 mins",
    rating: 4.9,
    reviewCount: 230,
    isVeg: true,
    calories: "540 kcal",
    description: "Steamed Basmati rice, slow-simmered sambar, rasam, 2 vegetable curries, curd, appalam, and semolina payasam.",
    popular: true,
  },
  {
    id: "f3",
    name: "Crispy Masala Dosa & Vada Combo",
    category: "breakfast",
    categoryLabel: "Breakfast",
    price: "₹65",
    prepTime: "5 mins",
    rating: 4.7,
    reviewCount: 198,
    isVeg: true,
    calories: "380 kcal",
    description: "Golden crispy crepe infused with spiced potato filling, served with coconut chutney, tomato dip, and hot lentil sambar.",
  },
  {
    id: "f4",
    name: "Grilled Veggie Club Sandwich",
    category: "snacks",
    categoryLabel: "Quick Snacks",
    price: "₹75",
    prepTime: "5 mins",
    rating: 4.6,
    reviewCount: 88,
    isVeg: true,
    calories: "290 kcal",
    description: "Triple-layer toasted whole-wheat sandwich stacked with crisp cucumber, tomatoes, cheese slice, and house herb pesto.",
  },
  {
    id: "f5",
    name: "Chilled Hazelnut Cold Coffee",
    category: "beverages",
    categoryLabel: "Beverages",
    price: "₹50",
    prepTime: "3 mins",
    rating: 4.9,
    reviewCount: 310,
    isVeg: true,
    calories: "190 kcal",
    description: "Freshly brewed espresso shaken with creamy chilled milk, cocoa syrup, and roasted hazelnut infusion.",
    popular: true,
  },
  {
    id: "f6",
    name: "Spicy Schezwan Fried Rice Bowl",
    category: "meals",
    categoryLabel: "Meals",
    price: "₹95",
    prepTime: "7 mins",
    rating: 4.7,
    reviewCount: 165,
    isVeg: true,
    calories: "460 kcal",
    description: "Wok-tossed long-grain rice with crispy garden vegetables, bell peppers, scallions, and signature fiery chili garlic sauce.",
  },
];

export function FoodVisualSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Items", icon: UtensilsCrossed },
    { id: "breakfast", label: "Breakfast", icon: Coffee },
    { id: "meals", label: "Thalis & Bowls", icon: Soup },
    { id: "snacks", label: "Quick Bites", icon: Sandwich },
    { id: "beverages", label: "Coolers & Coffee", icon: Coffee },
  ];

  const filteredDishes =
    activeCategory === "all"
      ? SAMPLE_DISHES
      : SAMPLE_DISHES.filter((dish) => dish.category === activeCategory);

  const handleSimulateOrder = (dishId: string) => {
    setAddedItem(dishId);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <section id="menu-preview" className="py-16 sm:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Campus Kitchen Special</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Freshly Prepared Daily Meals
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              Preview hot, nutritious food prepared right inside the campus canteen. Order directly through the student portal to secure your token.
            </p>
          </div>

          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/80 px-4 py-2.5 rounded-xl border border-orange-200 transition-colors self-start md:self-auto"
          >
            <span>Open Student Menu Portal</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-orange-400" : "text-slate-500"}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => {
            const isJustAdded = addedItem === dish.id;
            return (
              <div
                key={dish.id}
                className="group rounded-2xl bg-slate-50/70 border border-slate-200 p-5 hover:bg-white hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {dish.isVeg && (
                        <span className="w-4 h-4 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5" title="Vegetarian">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {dish.categoryLabel}
                      </span>
                    </div>

                    {dish.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                        Top Pick
                      </span>
                    )}
                  </div>

                  {/* Dish Name */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {dish.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>

                  {/* Meta pills: time, calories, rating */}
                  <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dish.prepTime}</span>
                    </div>
                    <span>•</span>
                    <span className="text-slate-500">{dish.calories}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{dish.rating}</span>
                      <span className="text-slate-400 text-[11px]">({dish.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Price & Order CTA */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Student Price</span>
                    <span className="text-xl font-extrabold text-slate-900">{dish.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulateOrder(dish.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isJustAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nutritional Banner */}
        <div className="mt-12 rounded-2xl bg-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold">100% Campus Certified Hygiene & Quality</h4>
            <p className="text-sm text-slate-400 max-w-xl">
              All ingredients are locally sourced with automated batch expiration tracking recorded directly into the Administrator dashboard.
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-md shadow-orange-500/20 transition-all"
          >
            Sign In to Order Now
          </Link>
        </div>
      </div>
    </section>
  );
}
