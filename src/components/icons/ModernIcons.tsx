
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Eye,
  Download,
  Copy,
  Check,
  X,
  Menu,
  Search,
  Filter,
  Grid,
  List,
  Settings,
  User,
  Code,
  Database,
  Server,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Zap,
  Shield,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Home,
  Phone,
  Send,
  MessageCircle,
  ThumbsUp,
  Share,
  Bookmark,
  Tag,
  Folder,
  File,
  Image,
  Video,
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  CloudSun,
  Loader2,
  RefreshCw,
  MoreHorizontal,
  MoreVertical,
  Bell,
  BellOff,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Bluetooth,
  Camera,
  Headphones,
  Mic,
  MicOff,
  MousePointer,
  Keyboard,
  HardDrive,
  Cpu,
  MemoryStick,
  CloudDownload,
  CloudUpload,
  Link,
  Unlink,
  Paperclip,
  Scissors,
  Edit,
  Edit2,
  Edit3,
  Trash,
  Trash2,
  Save,
  Plus,
  Minus,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Crosshair,
  Navigation,
  Compass,
  AlertTriangle,
  Info,
  type LucideIcon,
} from "lucide-react"
import React from "react"
import { cn } from "../../utils/styles"
export const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
  "3xl": "w-12 h-12",
} as const
interface IconProps {
  icon: LucideIcon
  size?: keyof typeof iconSizes
  className?: string
  strokeWidth?: number
  "aria-label"?: string
  "aria-hidden"?: boolean
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = "md",
  className,
  strokeWidth = 2,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden = !ariaLabel,
  ...props
}) => {
  return (
    <IconComponent
      className={cn(iconSizes[size], className)}
      strokeWidth={strokeWidth}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    />
  )
}
export const icons = {
  navigation: {
    menu: Menu,
    close: X,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    arrowRight: ArrowRight,
    arrowUpRight: ArrowUpRight,
    home: Home,
    back: ArrowDown,
    forward: ArrowUp,
  },
  social: {
    github: Github,
    linkedin: Linkedin,
    email: Mail,
    phone: Phone,
    send: Send,
    share: Share,
    message: MessageCircle,
  },
  actions: {
    download: Download,
    copy: Copy,
    check: Check,
    close: X,
    edit: Edit2,
    delete: Trash2,
    save: Save,
    add: Plus,
    remove: Minus,
    search: Search,
    filter: Filter,
    refresh: RefreshCw,
    settings: Settings,
  },
  status: {
    loading: Loader2,
    spinner: Loader2,
    success: Check,
    error: X,
    warning: AlertTriangle,
    info: Info,
    star: Star,
    heart: Heart,
    thumbsUp: ThumbsUp,
  },
  layout: {
    grid: Grid,
    list: List,
    maximize: Maximize,
    minimize: Minimize,
    zoomIn: ZoomIn,
    zoomOut: ZoomOut,
    eye: Eye,
    bookmark: Bookmark,
  },
  tech: {
    code: Code,
    database: Database,
    server: Server,
    globe: Globe,
    smartphone: Smartphone,
    monitor: Monitor,
    palette: Palette,
    zap: Zap,
    shield: Shield,
    cpu: Cpu,
    hardDrive: HardDrive,
    wifi: Wifi,
    cloud: CloudDownload,
  },
  professional: {
    briefcase: Briefcase,
    award: Award,
    graduation: GraduationCap,
    user: User,
    users: Users,
    calendar: Calendar,
    clock: Clock,
    location: MapPin,
    trending: TrendingUp,
    activity: Activity,
    chart: BarChart,
  },
  theme: {
    sun: Sun,
    moon: Moon,
    cloudSun: CloudSun,
    link: Link,
    externalLink: ExternalLink,
    file: File,
    folder: Folder,
    tag: Tag,
  },
} as const
export const AnimatedIcon: React.FC<
  IconProps & {
    animation?: "spin" | "pulse" | "bounce" | "ping"
  }
> = ({ animation, className, ...props }) => {
  const animationClass = animation ? `animate-${animation}` : ""

  return <Icon className={cn(animationClass, className)} {...props} />
}
interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  size?: keyof typeof iconSizes
  variant?: "default" | "ghost" | "outline"
  "aria-label": string
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = "md",
  variant = "ghost",
  className,
  "aria-label": ariaLabel,
  ...props
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      aria-label={ariaLabel}
      {...props}
    >
      <Icon icon={icon} size={size} aria-hidden />
    </button>
  )
}
export {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Code,
  Database,
  Server,
  Globe,
  Star,
  Heart,
  Eye,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Loader2,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  TrendingUp,
  Activity,
} from "lucide-react"

export default icons
