import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import {
  filterCategories,
  filterSizes,
  filterColors,
  filterPrices,
  filterMaterials,
} from "@/data/products";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = false }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filter-section">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="py-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CheckboxItemProps {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}

const CheckboxItem = ({ label, checked = false, onChange }: CheckboxItemProps) => (
  <button
    onClick={onChange}
    className="flex items-center gap-3 py-1.5 w-full text-left group"
  >
    <div
      className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${
        checked
          ? "bg-foreground border-foreground"
          : "border-border group-hover:border-foreground"
      }`}
    >
      {checked && <Check className="w-3 h-3 text-background" />}
    </div>
    <span className="text-sm text-foreground">{label}</span>
  </button>
);

export const FilterSidebar = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All Bottoms"]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const toggleItem = (item: string, list: string[], setList: (items: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <aside className="w-full lg:w-[250px] flex-shrink-0 pr-6">
      <div className="sticky top-20">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Filter
        </h2>

        <FilterSection title="Category" defaultOpen>
          <div className="space-y-1">
            {filterCategories.map((category) => (
              <CheckboxItem
                key={category}
                label={category}
                checked={selectedCategories.includes(category)}
                onChange={() => toggleItem(category, selectedCategories, setSelectedCategories)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Size" defaultOpen>
          <div className="flex flex-wrap gap-2">
            {filterSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleItem(size, selectedSizes, setSelectedSizes)}
                className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                  selectedSizes.includes(size)
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Color" defaultOpen>
          <div className="flex flex-wrap gap-3">
            {filterColors.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleItem(color.name, selectedColors, setSelectedColors)}
                className={`relative group`}
                title={color.name}
              >
                <div
                  className={`color-swatch ${
                    selectedColors.includes(color.name) ? "ring-2 ring-foreground ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price">
          <div className="space-y-1">
            {filterPrices.map((price) => (
              <CheckboxItem
                key={price}
                label={price}
                checked={selectedPrices.includes(price)}
                onChange={() => toggleItem(price, selectedPrices, setSelectedPrices)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Material">
          <div className="space-y-1">
            {filterMaterials.map((material) => (
              <CheckboxItem
                key={material}
                label={material}
                checked={selectedMaterials.includes(material)}
                onChange={() => toggleItem(material, selectedMaterials, setSelectedMaterials)}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
};
