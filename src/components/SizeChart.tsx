import { motion } from "framer-motion";
import { Size, sizeRanges } from "@/utils/sizeCalculator";

interface SizeChartProps {
  recommendedSize: Size | null;
}

export const SizeChart = ({ recommendedSize }: SizeChartProps) => {
  const sizes: Size[] = ["XS", "S", "M", "L", "XL"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-background border border-border rounded-xl p-4 shadow-lg"
    >
      <h4 className="text-sm font-semibold text-foreground mb-3">Size Guide</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-2 text-left text-muted-foreground font-medium">Size</th>
              <th className="py-2 px-2 text-center text-muted-foreground font-medium">Waist (in)</th>
              <th className="py-2 px-2 text-center text-muted-foreground font-medium">Hip (in)</th>
            </tr>
          </thead>
          <tbody>
            {sizeRanges.map((range) => {
              const isRecommended = range.size === recommendedSize;
              return (
                <motion.tr
                  key={range.size}
                  className={`border-b border-border/50 transition-colors ${
                    isRecommended ? "bg-primary/10" : ""
                  }`}
                  animate={isRecommended ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <td className={`py-2.5 px-2 font-medium ${isRecommended ? "text-primary" : "text-foreground"}`}>
                    {range.size}
                    {isRecommended && (
                      <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                        Best Fit
                      </span>
                    )}
                  </td>
                  <td className={`py-2.5 px-2 text-center ${isRecommended ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {range.waistMin === 0 ? `< ${range.waistMax}` : range.waistMax >= 100 ? `> ${range.waistMin}` : `${range.waistMin} - ${range.waistMax}`}
                  </td>
                  <td className={`py-2.5 px-2 text-center ${isRecommended ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {range.hipMin === 0 ? `< ${range.hipMax}` : range.hipMax >= 100 ? `> ${range.hipMin}` : `${range.hipMin} - ${range.hipMax}`}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
