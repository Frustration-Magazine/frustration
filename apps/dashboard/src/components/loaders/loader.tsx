// 🔩 Base
import styles from "./loader.module.css";
import { cn } from "@/lib/utils";

export const Loader = ({ className }: { className?: string }) => (
  <div className={cn(styles.container, className)}>
    <div className={styles.electron}></div>
    <div className={styles.electron}></div>
  </div>
);
