import { useId, useState, type CSSProperties } from "react"
import {
  AlertCircleIcon,
  BoldIcon,
  CheckCircle2Icon,
  ChevronsUpDownIcon,
  CopyIcon,
  FileTextIcon,
  FolderOpenIcon,
  ItalicIcon,
  LoaderCircleIcon,
  MenuIcon,
  SearchIcon,
  UnderlineIcon,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { toast as sonnerToast } from "sonner"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button.variants"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DataTable,
  DataTableColumnHeader,
  createDataTableColumnHelper,
} from "@/components/ui/data-table"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DirectionProvider } from "@/components/ui/direction"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Form, FormActions, FormBody } from "@/components/ui/form"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toaster as ToastToaster, toast as baseToast } from "@/components/ui/toast"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Typeset } from "@/components/ui/typography"

const selectItems = [
  { label: "Design", value: "design" },
  { label: "Engineering", value: "engineering" },
  { label: "Research", value: "research" },
]

const chartData = [
  { month: "May", installs: 86 },
  { month: "Jun", installs: 124 },
  { month: "Jul", installs: 168 },
  { month: "Aug", installs: 212 },
]

const chartConfig = {
  installs: { label: "Installs", color: "var(--primary)" },
} satisfies ChartConfig

const comboboxItems = ["Design", "Engineering", "Research"]

const questionnaireItems = [
  {
    name: "identity",
    required: true,
    choices: [
      { value: "neutral" },
      { value: "tis" },
    ],
  },
  {
    name: "presetName",
    required: true,
  },
] as const

type ComponentRow = {
  component: string
  status: string
}

const dataTableColumnHelper = createDataTableColumnHelper<ComponentRow>()
const dataTableColumns = dataTableColumnHelper.columns([
  dataTableColumnHelper.accessor("component", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Component" />
    ),
    filterFn: "includesString",
    sortFn: "text",
  }),
  dataTableColumnHelper.accessor("status", {
    header: "Status",
    sortFn: "text",
  }),
])

const dataTableRows: ComponentRow[] = [
  { component: "Accordion", status: "Ready" },
  { component: "Button", status: "Ready" },
  { component: "Dialog", status: "Ready" },
  { component: "Table", status: "Ready" },
]

function CalendarPreview({ id }: { id: string }) {
  const [selected, setSelected] = useState(new Date(2026, 7, 20))
  const labelId = `${id}-calendar-label`

  return (
    <Field className="preview-form">
      <FieldLabel id={labelId}>Release date</FieldLabel>
      <Calendar
        aria-labelledby={labelId}
        defaultMonth={selected}
        mode="single"
        selected={selected}
        onSelect={(date) => date && setSelected(date)}
      />
    </Field>
  )
}

function CommandPreview() {
  const [executedCommand, setExecutedCommand] = useState("No command executed")

  return (
    <div className="preview-stack">
      <Command className="h-48 w-72 border">
        <CommandInput aria-label="Search commands" placeholder="Search commands…" />
        <CommandList>
          <CommandEmpty>No command found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem value="open component" onSelect={() => setExecutedCommand("Open component executed")}>
              Open component <CommandShortcut>⌘O</CommandShortcut>
            </CommandItem>
            <CommandItem value="copy install command" onSelect={() => setExecutedCommand("Copy install command executed")}>
              Copy install command <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <p aria-live="polite" className="text-xs text-muted-foreground">{executedCommand}</p>
    </div>
  )
}

function AttachmentPreview() {
  const [status, setStatus] = useState("No attachment action")

  return (
    <div className="preview-stack">
      <Attachment>
        <AttachmentMedia><FileTextIcon aria-hidden="true" /></AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>component-spec.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 248 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction
            aria-label="Remove component-spec.pdf"
            onClick={() => setStatus("Attachment removed")}
          >
            ×
          </AttachmentAction>
        </AttachmentActions>
        <AttachmentTrigger
          aria-label="Preview component-spec.pdf"
          onClick={() => setStatus("Attachment preview opened")}
        />
      </Attachment>
      <span className="sr-only" data-contract-status aria-live="polite">{status}</span>
    </div>
  )
}

function ButtonGroupPreview() {
  const [status, setStatus] = useState("No document action")

  return (
    <div className="preview-stack">
      <ButtonGroup aria-label="Document actions">
        <Button variant="outline" onClick={() => setStatus("Document archived")}>Archive</Button>
        <Button variant="outline" onClick={() => setStatus("Document reported")}>Report</Button>
        <Button variant="outline" onClick={() => setStatus("Document snoozed")}>Snooze</Button>
      </ButtonGroup>
      <span className="sr-only" data-contract-status aria-live="polite">{status}</span>
    </div>
  )
}

function EmptyPreview({ id }: { id: string }) {
  const [status, setStatus] = useState("No empty-state action")
  const titleId = `${id}-empty-title`

  return (
    <div className="preview-stack">
      <Empty className="preview-card" role="region" aria-labelledby={titleId}>
        <EmptyHeader>
          <EmptyMedia variant="icon"><FolderOpenIcon aria-hidden="true" /></EmptyMedia>
          <EmptyTitle id={titleId} role="heading" aria-level={4}>No components selected</EmptyTitle>
          <EmptyDescription>Choose a component to add it to the project.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" onClick={() => setStatus("Component browser opened")}>Browse components</Button>
        </EmptyContent>
      </Empty>
      <span className="sr-only" data-contract-status aria-live="polite">{status}</span>
    </div>
  )
}

function ItemPreview({ id }: { id: string }) {
  const [status, setStatus] = useState("No item action")
  const titleId = `${id}-item-title`

  return (
    <div className="preview-stack preview-wide">
      <Item variant="outline" role="article" aria-labelledby={titleId}>
        <ItemMedia variant="icon"><CheckCircle2Icon aria-hidden="true" /></ItemMedia>
        <ItemContent>
          <ItemTitle id={titleId} role="heading" aria-level={4}>Registry connected</ItemTitle>
          <ItemDescription>Component source can be installed locally.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline" onClick={() => setStatus("Registry details opened")}>Inspect</Button>
        </ItemActions>
      </Item>
      <span className="sr-only" data-contract-status aria-live="polite">{status}</span>
    </div>
  )
}

function SonnerPreview() {
  const [status, setStatus] = useState("No Sonner action")

  return (
    <>
      <Button
        variant="outline"
        onClick={() => sonnerToast.success("Theme saved", {
          duration: Infinity,
          action: {
            label: "Undo theme change",
            onClick: () => setStatus("Theme change undone"),
          },
        })}
      >
        Show Sonner toast
      </Button>
      <span className="sr-only" data-contract-status aria-live="polite">{status}</span>
      <SonnerToaster position="bottom-right" />
    </>
  )
}

function ToastPreview() {
  const [status, setStatus] = useState("No toast action")

  return (
    <>
      <Button
        variant="outline"
        onClick={() => baseToast.add({
          title: "Component installed",
          description: "Source files are now in your project.",
          type: "success",
          timeout: 0,
          actionProps: {
            children: "Undo install",
            onClick: () => setStatus("Installation undone"),
          },
        })}
      >
        Show Base UI toast
      </Button>
      <span className="sr-only" data-contract-status aria-live="polite">{status}</span>
      <ToastToaster />
    </>
  )
}

function QuestionnairePreview({ id }: { id: string }) {
  const inputLabelId = `${id}-preset-name-label`

  return (
    <Questionnaire
      aria-label="Identity setup"
      className="w-72 rounded-lg border p-4"
      items={questionnaireItems}
      shortcuts="numbers"
      onSubmit={(event) => event.preventDefault()}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="identity" required>
        <QuestionnaireTitle>Choose an identity</QuestionnaireTitle>
        <QuestionnaireDescription>Behavior stays the same in both options.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="neutral">Neutral</QuestionnaireChoice>
          <QuestionnaireChoice value="tis">TIS</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="presetName" required>
        <QuestionnaireTitle id={inputLabelId}>Name the preset</QuestionnaireTitle>
        <QuestionnaireDescription>Use a name the team will recognize.</QuestionnaireDescription>
        <QuestionnaireInput aria-labelledby={inputLabelId} />
        <QuestionnaireError>Enter a preset name to continue.</QuestionnaireError>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Apply</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function ComponentPreview({ name }: { name: string }) {
  const id = useId()

  switch (name) {
    case "accordion":
      return (
        <Accordion className="preview-wide" defaultValue={["overview"]}>
          <AccordionItem value="overview">
            <AccordionTrigger>What does source-first mean?</AccordionTrigger>
            <AccordionContent>
              The component code lives in the consumer project and can be adapted there.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="engine">
            <AccordionTrigger>Where does behavior come from?</AccordionTrigger>
            <AccordionContent>
              Base UI provides the accessible React behavior underneath each wrapper.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )

    case "alert":
      return (
        <div className="preview-stack preview-wide">
          <Alert role="status">
            <CheckCircle2Icon aria-hidden="true" />
            <AlertTitle>Ready to install</AlertTitle>
            <AlertDescription>The neutral theme is active.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircleIcon aria-hidden="true" />
            <AlertTitle>Review required</AlertTitle>
            <AlertDescription>Resolve the validation error before continuing.</AlertDescription>
            <AlertAction><Button size="xs" variant="ghost">Review</Button></AlertAction>
          </Alert>
        </div>
      )

    case "alert-dialog":
      return (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            Delete project
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )

    case "aspect-ratio":
      return (
        <figure className="w-64">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
            <div aria-hidden="true" className="flex size-full items-center justify-center text-sm font-medium">16:9</div>
          </AspectRatio>
          <figcaption className="sr-only">Widescreen component preview</figcaption>
        </figure>
      )

    case "attachment":
      return <AttachmentPreview />

    case "avatar":
      return (
        <AvatarGroup aria-label="Project members" role="group">
          <Avatar role="img" aria-label="Ana Martins"><AvatarFallback>AM</AvatarFallback></Avatar>
          <Avatar role="img" aria-label="João Silva"><AvatarFallback>JS</AvatarFallback></Avatar>
          <Avatar role="img" aria-label="Rita Kiala"><AvatarFallback>RK</AvatarFallback></Avatar>
          <AvatarGroupCount aria-label="4 more project members">+4</AvatarGroupCount>
        </AvatarGroup>
      )

    case "badge":
      return (
        <div className="preview-inline">
          <Badge>Default</Badge>
          <Badge variant="secondary">Beta</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive" role="status">Blocked</Badge>
        </div>
      )

    case "breadcrumb":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#top">Library</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#components">Components</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )

    case "bubble":
      return (
        <BubbleGroup className="w-72" role="log" aria-label="Theme support conversation">
          <Bubble variant="muted" role="article" aria-label="Question from developer"><BubbleContent>Can I use the neutral theme?</BubbleContent></Bubble>
          <Bubble align="end" role="article" aria-label="Answer from UI Foundation"><BubbleContent>Yes. The TIS identity is optional.</BubbleContent></Bubble>
        </BubbleGroup>
      )

    case "button":
      return (
        <div className="preview-inline">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled><LoaderCircleIcon className="animate-spin" data-icon="inline-start" />Loading</Button>
        </div>
      )

    case "button-group":
      return <ButtonGroupPreview />

    case "calendar":
      return <CalendarPreview id={id} />

    case "card": {
      const titleId = `${id}-card-title`
      return (
        <Card className="preview-card" role="region" aria-labelledby={titleId}>
          <CardHeader>
            <CardTitle id={titleId} role="heading" aria-level={4}>Component ownership</CardTitle>
            <CardDescription>Source code remains in your project.</CardDescription>
          </CardHeader>
          <CardContent>Adapt locally while preserving the public contract.</CardContent>
          <CardFooter><Button size="sm" variant="outline">View source</Button></CardFooter>
        </Card>
      )
    }

    case "carousel":
      return (
        <Carousel aria-label="Featured components" className="w-64">
          <CarouselContent>
            {[1, 2, 3].map((slide) => (
              <CarouselItem aria-label={`${slide} of 3`} key={slide}>
                <div className="flex h-28 items-center justify-center rounded-lg border bg-card text-2xl font-semibold">
                  {slide}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      )

    case "chart": {
      const summaryId = `${id}-chart-summary`
      return (
        <div>
          <ChartContainer
            config={chartConfig}
            className="h-40 w-72 aspect-auto"
            role="img"
            aria-label="Monthly component installs"
            aria-describedby={summaryId}
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="installs" fill="var(--color-installs)" radius={6} />
            </BarChart>
          </ChartContainer>
          <p id={summaryId} className="sr-only">
            Installs increased each month from 86 in May to 212 in August.
          </p>
        </div>
      )
    }

    case "checkbox": {
      const checkboxId = `${id}-checkbox`
      return (
        <Field orientation="horizontal" className="preview-control">
          <Checkbox id={checkboxId} defaultChecked />
          <FieldLabel htmlFor={checkboxId}>Include optional theme preset</FieldLabel>
        </Field>
      )
    }

    case "collapsible":
      return (
        <Collapsible className="preview-form" defaultOpen>
          <CollapsibleTrigger render={<Button variant="outline" className="preview-wide" />}>
            Package details
            <ChevronsUpDownIcon data-icon="inline-end" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
            React 19 · Base UI 1.7 · source registry
          </CollapsibleContent>
        </Collapsible>
      )

    case "combobox":
      return (
        <Field className="preview-form">
          <FieldLabel htmlFor={`${id}-combobox`}>Team</FieldLabel>
          <Combobox items={comboboxItems} defaultValue="Design">
            <ComboboxInput id={`${id}-combobox`} className="w-64" placeholder="Choose a team" showClear />
            <ComboboxContent>
              <ComboboxEmpty>No team found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      )

    case "command":
      return <CommandPreview />

    case "context-menu":
      return (
        <div className="preview-stack">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
              Actions
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Duplicate <DropdownMenuShortcut>⌘D</DropdownMenuShortcut></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ContextMenu>
            <ContextMenuTrigger className="flex h-28 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Right-click this area
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Open</ContextMenuItem>
              <ContextMenuItem>Duplicate <ContextMenuShortcut>⌘D</ContextMenuShortcut></ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      )

    case "data-table":
      return (
        <DataTable
          ariaLabel="Installable components"
          caption="Installable components and their status"
          className="preview-wide"
          columns={dataTableColumns}
          data={dataTableRows}
          filter={{
            columnId: "component",
            label: "Filter components",
            placeholder: "Filter components…",
          }}
          pageSize={3}
        />
      )

    case "date-picker":
      return (
        <Field className="preview-form">
          <FieldLabel htmlFor={`${id}-date-picker`}>Release date</FieldLabel>
          <DatePicker
            defaultValue={new Date(2026, 7, 20)}
            name="releaseDate"
            popoverLabel="Choose a release date"
            triggerProps={{ id: `${id}-date-picker` }}
            formatValue={(date) => date.toLocaleDateString("en-CA")}
          />
        </Field>
      )

    case "dialog":
      return (
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Install component</DialogTitle>
              <DialogDescription>
                The source and required dependencies will be added to your project.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
              <Button>Install</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case "direction":
      return (
        <DirectionProvider direction="rtl">
          <ButtonGroup aria-label="RTL example" dir="rtl">
            <Button variant="outline">الأول</Button>
            <Button variant="outline">التالي</Button>
          </ButtonGroup>
        </DirectionProvider>
      )

    case "drawer":
      return (
        <Drawer showSwipeHandle>
          <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Install component</DrawerTitle>
              <DrawerDescription>Review the source files before adding them.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Install</Button>
              <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )

    case "dropdown-menu":
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Project</DropdownMenuLabel>
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Rename <DropdownMenuShortcut>F2</DropdownMenuShortcut></DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )

    case "empty":
      return <EmptyPreview id={id} />

    case "field": {
      const fieldId = `${id}-field`
      const descriptionId = `${fieldId}-description`
      const errorId = `${fieldId}-error`
      return (
        <FieldGroup className="preview-form">
          <Field data-invalid>
            <FieldLabel htmlFor={fieldId}>Project name</FieldLabel>
            <Input id={fieldId} aria-invalid aria-describedby={`${descriptionId} ${errorId}`} />
            <FieldDescription id={descriptionId}>Used in the generated package metadata.</FieldDescription>
            <FieldError id={errorId}>Project name is required.</FieldError>
          </Field>
        </FieldGroup>
      )
    }

    case "form": {
      const formId = `${id}-form-name`
      const descriptionId = `${formId}-description`
      return (
        <Form
          aria-label="Project settings"
          className="preview-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <FormBody>
            <Field>
              <FieldLabel htmlFor={formId}>Project name</FieldLabel>
              <Input id={formId} name="projectName" required aria-describedby={descriptionId} />
              <FieldDescription id={descriptionId}>Required before saving.</FieldDescription>
            </Field>
          </FormBody>
          <FormActions>
            <Button type="reset" variant="outline">Reset</Button>
            <Button type="submit">Save project</Button>
          </FormActions>
        </Form>
      )
    }

    case "hover-card":
      return (
        <HoverCard>
          <HoverCardTrigger
            render={
              <a className={buttonVariants({ variant: "link" })} href="#components" />
            }
          >
            @ui-foundation
          </HoverCardTrigger>
          <HoverCardContent>
            <strong>UI Foundation</strong>
            <p className="text-muted-foreground">Source components with optional identity presets.</p>
          </HoverCardContent>
        </HoverCard>
      )

    case "input":
      return (
        <Field className="preview-form">
          <FieldLabel htmlFor={`${id}-input`}>Example input</FieldLabel>
          <Input id={`${id}-input`} className="preview-input" placeholder="Enter a value…" />
        </Field>
      )

    case "input-group": {
      const inputGroupId = `${id}-input-group`
      const textareaGroupId = `${id}-textarea-group`
      return (
        <FieldGroup className="preview-form">
          <Field>
            <FieldLabel id={`${inputGroupId}-label`} htmlFor={inputGroupId}>Search documentation</FieldLabel>
            <InputGroup aria-labelledby={`${inputGroupId}-label`}>
              <InputGroupAddon><SearchIcon aria-hidden="true" /></InputGroupAddon>
              <InputGroupInput id={inputGroupId} placeholder="Search…" />
              <InputGroupAddon align="inline-end"><Kbd>⌘K</Kbd></InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel id={`${textareaGroupId}-label`} htmlFor={textareaGroupId}>Review notes</FieldLabel>
            <InputGroup aria-labelledby={`${textareaGroupId}-label`}>
              <InputGroupAddon>Note</InputGroupAddon>
              <InputGroupTextarea id={textareaGroupId} placeholder="Add context…" />
            </InputGroup>
          </Field>
        </FieldGroup>
      )
    }

    case "input-otp":
      return (
        <Field className="preview-form" data-invalid>
          <FieldLabel htmlFor={`${id}-otp`}>Verification code</FieldLabel>
          <InputOTP id={`${id}-otp`} aria-invalid autoComplete="one-time-code" inputMode="numeric" maxLength={6} defaultValue="248">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldError>Enter all six digits.</FieldError>
        </Field>
      )

    case "item":
      return <ItemPreview id={id} />

    case "kbd":
      return (
        <div className="preview-inline">
          <span>Open search</span>
          <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
        </div>
      )

    case "label": {
      const labelId = `${id}-label`
      return (
        <div className="preview-form">
          <Label htmlFor={labelId}>Visible label</Label>
          <Input id={labelId} placeholder="Labeled input" />
        </div>
      )
    }

    case "marker":
      return (
        <Marker className="w-72" variant="separator" role="status">
          <MarkerIcon><CheckCircle2Icon /></MarkerIcon>
          <MarkerContent>12 components validated</MarkerContent>
        </Marker>
      )

    case "menubar":
      return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>New file <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                <MenubarItem>Open</MenubarItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem>Close</MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )

    case "message":
      return (
        <Message className="w-72" role="article" aria-label="Message from UI Foundation">
          <MessageAvatar aria-hidden="true">UI</MessageAvatar>
          <MessageContent>
            <MessageHeader>UI Foundation</MessageHeader>
            <Bubble variant="muted"><BubbleContent>The component is ready to install.</BubbleContent></Bubble>
            <MessageFooter>Delivered</MessageFooter>
          </MessageContent>
        </Message>
      )

    case "message-scroller":
      return (
        <MessageScrollerProvider defaultScrollPosition="start">
          <MessageScroller className="h-44 w-72 rounded-lg border">
            <MessageScrollerViewport aria-label="Component conversation">
              <MessageScrollerContent
                className="gap-3 p-3"
                role="log"
                aria-label="Component conversation"
                aria-live="polite"
              >
                {[1, 2, 3, 4].map((message) => (
                  <MessageScrollerItem key={message} messageId={`message-${message}`} scrollAnchor={message === 4}>
                    <Bubble variant={message % 2 ? "muted" : "default"} align={message % 2 ? "start" : "end"}>
                      <BubbleContent>Message {message}</BubbleContent>
                    </Bubble>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      )

    case "native-select":
      return (
        <Field className="preview-form">
          <FieldLabel htmlFor={`${id}-native-select`}>Release channel</FieldLabel>
          <NativeSelect id={`${id}-native-select`} defaultValue="stable">
            <NativeSelectOption value="stable">Stable</NativeSelectOption>
            <NativeSelectOption value="preview">Preview</NativeSelectOption>
            <NativeSelectOption value="canary">Canary</NativeSelectOption>
          </NativeSelect>
        </Field>
      )

    case "navigation-menu":
      return (
        <NavigationMenu aria-label="Primary">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-72 gap-1 p-2">
                  <NavigationMenuLink active href="#components">Browse catalog</NavigationMenuLink>
                  <NavigationMenuLink href="#top">Installation</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem><NavigationMenuLink href="#top">Themes</NavigationMenuLink></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )

    case "pagination":
      return (
        <Pagination aria-label="Component pages">
          <PaginationContent>
            <PaginationItem><PaginationPrevious disabled /></PaginationItem>
            <PaginationItem><PaginationLink aria-label="Page 1" href="#page-1" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink aria-label="Page 2" href="#page-2">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationNext href="#page-2" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      )

    case "popover":
      return (
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Theme preset</PopoverTitle>
              <PopoverDescription>Choose a visual identity without changing behavior.</PopoverDescription>
            </PopoverHeader>
            <Button size="sm">Apply preset</Button>
          </PopoverContent>
        </Popover>
      )

    case "progress":
      return (
        <Progress className="preview-form" value={68}>
          <ProgressLabel>Installation</ProgressLabel>
          <ProgressValue />
        </Progress>
      )

    case "questionnaire":
      return <QuestionnairePreview id={id} />

    case "radio-group":
      return (
        <FieldSet className="preview-form">
          <FieldLegend variant="label">Distribution</FieldLegend>
          <RadioGroup aria-label="Distribution" defaultValue="source">
            <Field orientation="horizontal">
              <RadioGroupItem id={`${id}-source`} value="source" />
              <FieldLabel htmlFor={`${id}-source`}>Source files</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem id={`${id}-package`} value="package" />
              <FieldLabel htmlFor={`${id}-package`}>Package</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      )

    case "resizable":
      return (
        <ResizablePanelGroup orientation="horizontal" className="h-32 w-72 overflow-hidden rounded-lg border">
          <ResizablePanel defaultSize={45}><div className="flex size-full items-center justify-center text-sm">Panel A</div></ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55}><div className="flex size-full items-center justify-center text-sm">Panel B</div></ResizablePanel>
        </ResizablePanelGroup>
      )

    case "scroll-area":
      return (
        <ScrollArea
          className="h-32 w-64 rounded-lg border"
          viewportProps={{
            "aria-label": "Component list",
            role: "region",
            tabIndex: 0,
          }}
        >
          <div className="flex flex-col gap-2 p-3">
            {Array.from({ length: 8 }, (_, index) => <p key={index} className="text-sm">Component {index + 1}</p>)}
          </div>
        </ScrollArea>
      )

    case "select":
      return (
        <Select items={selectItems} defaultValue="design">
          <SelectTrigger className="preview-input" aria-label="Team">
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {selectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )

    case "separator":
      return (
        <div className="separator-preview">
          <span>Before</span><Separator decorative={false} /><span>After</span>
          <Separator orientation="vertical" />
          <span>Vertical</span>
        </div>
      )

    case "sheet":
      return (
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Component settings</SheetTitle>
              <SheetDescription>Configure the local source before installation.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

    case "sidebar":
      return (
        <SidebarProvider className="relative h-48 min-h-0 w-72 overflow-hidden rounded-lg border" style={{ "--sidebar-width": "11rem" } as CSSProperties}>
          <Sidebar className="!absolute !inset-y-0 !left-0 !h-full" collapsible="icon">
            <SidebarContent aria-label="Component catalog" role="navigation">
              <SidebarGroup>
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton aria-current="page" isActive render={<a href="#components" />}>
                        <MenuIcon />Components
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton render={<a href="#top" />}>
                        <SearchIcon />Search
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="min-w-0 items-center justify-center">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">Content</span>
          </SidebarInset>
        </SidebarProvider>
      )

    case "skeleton":
      return (
        <div className="skeleton-preview" role="status" aria-label="Loading content" aria-busy="true">
          <Skeleton className="skeleton-avatar" />
          <div><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line short" /></div>
        </div>
      )

    case "slider":
      return <Slider className="w-64" defaultValue={35} getThumbAriaLabel={() => "Volume"} />

    case "sonner":
      return <SonnerPreview />

    case "spinner":
      return (
        <div className="preview-inline">
          <Spinner />
          <Spinner className="size-5 text-primary" aria-label="Loading preview" />
          <Button disabled><Spinner data-icon="inline-start" aria-hidden="true" />Saving</Button>
        </div>
      )

    case "switch": {
      const switchId = `${id}-switch`
      return (
        <Field orientation="horizontal" className="preview-control">
          <Switch id={switchId} defaultChecked />
          <FieldLabel htmlFor={switchId}>Use dark mode</FieldLabel>
        </Field>
      )
    }

    case "table":
      return (
        <Table className="w-72">
          <TableCaption>Installed components</TableCaption>
          <TableHeader><TableRow><TableHead scope="col">Component</TableHead><TableHead scope="col">Status</TableHead></TableRow></TableHeader>
          <TableBody>
            <TableRow><TableCell>Button</TableCell><TableCell>Ready</TableCell></TableRow>
            <TableRow><TableCell>Dialog</TableCell><TableCell>Ready</TableCell></TableRow>
          </TableBody>
        </Table>
      )

    case "tabs":
      return (
        <Tabs className="preview-form" defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">Interactive component preview.</TabsContent>
          <TabsContent value="code">Installable source registry entry.</TabsContent>
        </Tabs>
      )

    case "textarea":
      return (
        <Field className="preview-form">
          <FieldLabel htmlFor={`${id}-textarea`}>Example textarea</FieldLabel>
          <Textarea id={`${id}-textarea`} className="preview-input" placeholder="Describe the intended experience…" />
        </Field>
      )

    case "toast":
      return <ToastPreview />

    case "toggle":
      return (
        <Toggle defaultPressed>
          <BoldIcon aria-hidden="true" />
          Bold
        </Toggle>
      )

    case "toggle-group":
      return (
        <div className="preview-inline items-start">
          <ToggleGroup aria-label="Text formatting" defaultValue={["bold"]} multiple>
            <ToggleGroupItem aria-label="Bold" value="bold"><BoldIcon /></ToggleGroupItem>
            <ToggleGroupItem aria-label="Italic" value="italic"><ItalicIcon /></ToggleGroupItem>
            <ToggleGroupItem aria-label="Underline" value="underline"><UnderlineIcon /></ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup aria-label="Text alignment" defaultValue={["left"]} orientation="vertical" size="sm">
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )

    case "tooltip":
      return (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Copy component source"
                size="icon"
                variant="outline"
              />
            }
          >
            <CopyIcon aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Copy component source</TooltipContent>
        </Tooltip>
      )

    case "typography":
      return (
        <Typeset as="article" density="compact" className="preview-card">
          <h4>Readable content</h4>
          <p>
            Semantic HTML follows the active theme without replacing headings,
            lists, links, or code with custom elements.
          </p>
          <ul>
            <li>Token-aware color</li>
            <li>Consistent reading rhythm</li>
          </ul>
        </Typeset>
      )

    default:
      return null
  }
}

export { ComponentPreview }
