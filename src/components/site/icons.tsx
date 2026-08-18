import {
  Globe,
  Smartphone,
  TrendingUp,
  LayoutDashboard,
  Rocket,
  Cpu,
  Shield,
  Gauge,
  Wand2,
  Users,
  LifeBuoy,
  Palette,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Maps icon names stored in the DB (services.icon) to lucide components.
const map: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  TrendingUp,
  LayoutDashboard,
  Rocket,
  Cpu,
  Shield,
  Gauge,
  Wand2,
  Users,
  LifeBuoy,
  Palette,
  Zap,
};

export function resolveIcon(name?: string | null): LucideIcon {
  if (name && map[name]) return map[name];
  return Globe;
}
