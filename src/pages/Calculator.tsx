import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ALL_RECIPES,
  CATEGORY_LABELS,
  RESOURCE_NAMES,
  RESOURCE_EMOJI,
  type Tier,
  type Category,
  type ItemType,
  type Recipe,
  type ResourceType,
} from "@/data/recipes"
import Icon from "@/components/ui/icon"

const TIERS: Tier[] = ["T3", "T4", "T5", "T6", "T7", "T8"]

const TIER_COLORS: Record<Tier, string> = {
  T3: "bg-green-900/60 text-green-300 border-green-700",
  T4: "bg-blue-900/60 text-blue-300 border-blue-700",
  T5: "bg-yellow-900/60 text-yellow-300 border-yellow-700",
  T6: "bg-orange-900/60 text-orange-300 border-orange-700",
  T7: "bg-purple-900/60 text-purple-300 border-purple-700",
  T8: "bg-red-900/60 text-red-300 border-red-700",
}

const TYPE_TABS: { value: ItemType | "all"; label: string }[] = [
  { value: "all", label: "Всё" },
  { value: "weapon", label: "Оружие" },
  { value: "armor", label: "Доспехи" },
]

const WEAPON_GROUPS: { label: string; categories: Category[] }[] = [
  { label: "Ближний бой", categories: ["sword", "axe", "mace", "hammer", "spear", "quarterstaff", "dagger"] },
  { label: "Дальний бой", categories: ["bow", "warbow", "crossbow"] },
  { label: "Магия", categories: ["fire_staff", "frost_staff", "arcane_staff", "holy_staff", "nature_staff", "cursed_staff"] },
  { label: "Доп. снаряжение", categories: ["shield", "torch", "off_hand_tome"] },
]

const ARMOR_GROUPS: { label: string; categories: Category[] }[] = [
  { label: "Пластина", categories: ["plate_helmet", "plate_armor", "plate_boots"] },
  { label: "Кожа", categories: ["leather_helmet", "leather_armor", "leather_boots"] },
  { label: "Ткань", categories: ["cloth_helmet", "cloth_armor", "cloth_boots"] },
]

interface CartItem {
  recipe: Recipe
  qty: number
}

export default function Calculator() {
  const [typeFilter, setTypeFilter] = useState<ItemType | "all">("all")
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [resourceOverrides, setResourceOverrides] = useState<Partial<Record<ResourceType, number>>>({})
  const [resourcePrices, setResourcePrices] = useState<Partial<Record<ResourceType, number>>>({})

  const filtered = useMemo(() => {
    return ALL_RECIPES.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false
      if (tierFilter !== "all" && r.tier !== tierFilter) return false
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [typeFilter, tierFilter, search])

  const addToCart = (recipe: Recipe) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.recipe.id === recipe.id)
      if (existing) return prev.map((i) => i.recipe.id === recipe.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { recipe, qty: 1 }]
    })
  }

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.recipe.id !== id))

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return }
    setCart((prev) => prev.map((i) => i.recipe.id === id ? { ...i, qty } : i))
  }

  const totals = useMemo(() => {
    const map: Partial<Record<ResourceType, number>> = {}
    cart.forEach(({ recipe, qty }) => {
      recipe.resources.forEach(({ resource, amount }) => {
        map[resource] = (map[resource] ?? 0) + amount * qty
      })
    })
    return Object.entries(map) as [ResourceType, number][]
  }, [cart])

  const effectiveTotals = useMemo(() => {
    return totals.map(([resource, amount]) => ({
      resource,
      amount: resourceOverrides[resource] ?? amount,
      baseAmount: amount,
      price: resourcePrices[resource] ?? 0,
    }))
  }, [totals, resourceOverrides, resourcePrices])

  const grandTotal = useMemo(() => {
    return effectiveTotals.reduce((sum, { amount, price }) => sum + amount * price, 0)
  }, [effectiveTotals])

  const setOverride = (resource: ResourceType, val: number) => {
    setResourceOverrides(prev => ({ ...prev, [resource]: val }))
  }

  const setPrice = (resource: ResourceType, val: number) => {
    setResourcePrices(prev => ({ ...prev, [resource]: val }))
  }

  const clearCart = () => {
    setCart([])
    setResourceOverrides({})
    setResourcePrices({})
  }

  const groups = typeFilter === "armor"
    ? ARMOR_GROUPS
    : typeFilter === "weapon"
    ? WEAPON_GROUPS
    : [...WEAPON_GROUPS, ...ARMOR_GROUPS]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-white transition-colors">
              <Icon name="ArrowLeft" size={20} />
            </a>
            <h1 className="font-orbitron text-xl font-bold text-white">
              Albion <span className="text-red-500">Крафт</span>
            </h1>
            <Badge variant="outline" className="border-red-500/40 text-red-400 text-xs">Калькулятор</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="ShoppingCart" size={18} className="text-gray-400" />
            <span className="text-sm text-gray-300">{cart.reduce((s, i) => s + i.qty, 0)} предметов</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* LEFT: Items */}
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Type */}
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              {TYPE_TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTypeFilter(t.value as ItemType | "all")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    typeFilter === t.value
                      ? "bg-red-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tier */}
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setTierFilter("all")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  tierFilter === "all" ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Все тиры
              </button>
              {TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(tierFilter === t ? "all" : t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                    tierFilter === t ? TIER_COLORS[t] : "text-gray-500 border-transparent hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск предмета..."
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-9"
              />
            </div>
          </div>

          {/* Groups */}
          <div className="space-y-8">
            {groups.map((group) => {
              const groupItems = filtered.filter((r) => group.categories.includes(r.category))
              if (groupItems.length === 0) return null
              return (
                <div key={group.label}>
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-space-mono">
                    {group.label}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {groupItems.map((recipe) => {
                      const inCart = cart.find((i) => i.recipe.id === recipe.id)
                      return (
                        <div
                          key={recipe.id}
                          className={`rounded-xl border p-4 flex flex-col gap-3 transition-all cursor-pointer hover:border-red-500/50 ${
                            inCart ? "border-red-500/60 bg-red-950/20" : "border-white/8 bg-white/3"
                          }`}
                          onClick={() => addToCart(recipe)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-white leading-tight">{recipe.name}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${TIER_COLORS[recipe.tier]}`}>
                              {recipe.tier}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {recipe.resources.map(({ resource, amount }) => (
                              <span
                                key={resource}
                                className="text-xs bg-white/8 text-gray-300 rounded-md px-2 py-1 flex items-center gap-1"
                              >
                                <span>{RESOURCE_EMOJI[resource] ?? "📦"}</span>
                                <span>{RESOURCE_NAMES[resource]}</span>
                                <span className="text-white font-bold">×{amount}</span>
                              </span>
                            ))}
                          </div>
                          {inCart && (
                            <div className="flex items-center gap-2 mt-1">
                              <Icon name="Check" size={14} className="text-red-400" />
                              <span className="text-xs text-red-400">В корзине: {inCart.qty} шт.</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                <Icon name="SearchX" size={40} className="mx-auto mb-4 opacity-40" />
                <p>Ничего не найдено</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Cart + Totals */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/3 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-orbitron text-sm font-bold text-white flex items-center gap-2">
                  <Icon name="ShoppingCart" size={16} className="text-red-400" />
                  Список крафта
                </h3>
                {cart.length > 0 && (
                  <button onClick={clearCart} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
                    Очистить
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <Icon name="Package" size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Нажмите на предмет, чтобы добавить</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map(({ recipe, qty }) => (
                    <div key={recipe.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{recipe.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(recipe.id, qty - 1)}
                          className="w-6 h-6 rounded bg-white/10 text-gray-300 hover:bg-red-500/40 flex items-center justify-center text-xs transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value)
                            if (!isNaN(val)) updateQty(recipe.id, val)
                          }}
                          className="w-12 text-center text-sm font-bold text-white bg-white/10 border border-white/15 rounded px-1 py-0.5 focus:outline-none focus:border-red-500/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => updateQty(recipe.id, qty + 1)}
                          className="w-6 h-6 rounded bg-white/10 text-gray-300 hover:bg-red-500/40 flex items-center justify-center text-xs transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(recipe.id)}
                          className="w-6 h-6 rounded bg-white/5 text-gray-500 hover:bg-red-900/40 hover:text-red-400 flex items-center justify-center transition-colors ml-1"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            {effectiveTotals.length > 0 && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-4">
                <h3 className="font-orbitron text-sm font-bold text-red-400 mb-1 flex items-center gap-2">
                  <Icon name="Layers" size={16} />
                  Итого ресурсов
                </h3>
                <p className="text-xs text-gray-500 mb-3">Количество и цену можно изменить вручную</p>

                {/* Column headers */}
                <div className="grid grid-cols-[1fr_72px_80px] gap-1 mb-2 px-1">
                  <span className="text-xs text-gray-600">Ресурс</span>
                  <span className="text-xs text-gray-600 text-center">Кол-во</span>
                  <span className="text-xs text-gray-600 text-center">Цена / шт.</span>
                </div>

                <div className="space-y-2">
                  {effectiveTotals.map(({ resource, amount, baseAmount, price }) => {
                    const lineTotal = amount * price
                    return (
                      <div key={resource} className="space-y-1">
                        <div className="grid grid-cols-[1fr_72px_80px] gap-1 items-center">
                          <span className="text-xs text-gray-300 flex items-center gap-1.5 truncate">
                            <span>{RESOURCE_EMOJI[resource] ?? "📦"}</span>
                            <span className="truncate">{RESOURCE_NAMES[resource]}</span>
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={amount}
                            onChange={(e) => {
                              const val = parseInt(e.target.value)
                              if (!isNaN(val) && val >= 0) setOverride(resource as ResourceType, val)
                            }}
                            className={`w-full text-center text-xs font-bold rounded px-1 py-1 border focus:outline-none focus:border-red-500/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                              amount !== baseAmount
                                ? "bg-yellow-950/40 border-yellow-600/40 text-yellow-300"
                                : "bg-white/8 border-white/10 text-white"
                            }`}
                          />
                          <input
                            type="number"
                            min={0}
                            value={price || ""}
                            placeholder="0"
                            onChange={(e) => {
                              const val = parseInt(e.target.value)
                              setPrice(resource as ResourceType, isNaN(val) ? 0 : val)
                            }}
                            className="w-full text-center text-xs font-bold text-green-300 bg-green-950/30 border border-green-700/30 rounded px-1 py-1 focus:outline-none focus:border-green-500/60 placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        {price > 0 && (
                          <div className="text-right text-xs text-gray-400">
                            = <span className="text-green-400 font-semibold">{lineTotal.toLocaleString()} 💰</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Grand total */}
                {grandTotal > 0 && (
                  <div className="mt-4 pt-3 border-t border-red-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Итоговая стоимость</span>
                      <span className="text-base font-bold text-green-400">{grandTotal.toLocaleString()} 💰</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">серебро</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}