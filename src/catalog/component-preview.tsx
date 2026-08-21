import { useId, type CSSProperties } from "react"
import {
  AlertCircleIcon,
  BoldIcon,
  CheckCircle2Icon,
  ChevronsUpDownIcon,
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
  QuestionnaireItem,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
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
          <Alert>
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
        <AspectRatio ratio={16 / 9} className="w-64 overflow-hidden rounded-lg bg-muted">
          <div className="flex size-full items-center justify-center text-sm font-medium">16:9 preview</div>
        </AspectRatio>
      )

    case "attachment":
      return (
        <Attachment>
          <AttachmentMedia><FileTextIcon /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>component-spec.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 248 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove attachment" variant="ghost">×</AttachmentAction>
          </AttachmentActions>
        </Attachment>
      )

    case "avatar":
      return (
        <AvatarGroup aria-label="Project members">
          <Avatar><AvatarFallback>AM</AvatarFallback></Avatar>
          <Avatar><AvatarFallback>JS</AvatarFallback></Avatar>
          <Avatar><AvatarFallback>RK</AvatarFallback></Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      )

    case "badge":
      return (
        <div className="preview-inline">
          <Badge>Default</Badge>
          <Badge variant="secondary">Beta</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Blocked</Badge>
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
        <BubbleGroup className="w-72">
          <Bubble variant="muted"><BubbleContent>Can I use the neutral theme?</BubbleContent></Bubble>
          <Bubble align="end"><BubbleContent>Yes. The TIS identity is optional.</BubbleContent></Bubble>
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
      return (
        <ButtonGroup aria-label="Text alignment">
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      )

    case "calendar":
      return (
        <Calendar
          mode="single"
          defaultMonth={new Date(2026, 7, 1)}
          selected={new Date(2026, 7, 20)}
          className="rounded-lg border"
        />
      )

    case "card":
      return (
        <Card className="preview-card">
          <CardHeader>
            <CardTitle>Component ownership</CardTitle>
            <CardDescription>Source code remains in your project.</CardDescription>
          </CardHeader>
          <CardContent>Adapt locally while preserving the public contract.</CardContent>
          <CardFooter><Button size="sm" variant="outline">View source</Button></CardFooter>
        </Card>
      )

    case "carousel":
      return (
        <Carousel className="w-64">
          <CarouselContent>
            {[1, 2, 3].map((slide) => (
              <CarouselItem key={slide}>
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

    case "chart":
      return (
        <ChartContainer config={chartConfig} className="h-40 w-72 aspect-auto" role="img" aria-label="Monthly component installs">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="installs" fill="var(--color-installs)" radius={6} />
          </BarChart>
        </ChartContainer>
      )

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
        <Combobox items={comboboxItems} defaultValue="Design">
          <ComboboxInput className="w-64" aria-label="Team" placeholder="Choose a team" />
          <ComboboxContent>
            <ComboboxEmpty>No team found.</ComboboxEmpty>
            <ComboboxList>
              {comboboxItems.map((item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>)}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )

    case "command":
      return (
        <Command className="h-48 w-72 border">
          <CommandInput aria-label="Search commands" placeholder="Search commands…" />
          <CommandList>
            <CommandEmpty>No command found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>Open component <CommandShortcut>⌘O</CommandShortcut></CommandItem>
              <CommandItem>Copy install command <CommandShortcut>⌘C</CommandShortcut></CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

    case "context-menu":
      return (
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
        <DatePicker
          defaultValue={new Date(2026, 7, 20)}
          name="releaseDate"
          formatValue={(date) => date.toLocaleDateString("en-CA")}
        />
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
      return (
        <Empty className="preview-card">
          <EmptyHeader>
            <EmptyMedia variant="icon"><FolderOpenIcon /></EmptyMedia>
            <EmptyTitle>No components selected</EmptyTitle>
            <EmptyDescription>Choose a component to add it to the project.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button size="sm">Browse components</Button></EmptyContent>
        </Empty>
      )

    case "field": {
      const fieldId = `${id}-field`
      return (
        <FieldGroup className="preview-form">
          <Field>
            <FieldLabel htmlFor={fieldId}>Project name</FieldLabel>
            <Input id={fieldId} defaultValue="Customer portal" />
            <FieldDescription>Used in the generated package metadata.</FieldDescription>
          </Field>
        </FieldGroup>
      )
    }

    case "form": {
      const formId = `${id}-form-name`
      return (
        <Form
          className="preview-form"
          onSubmit={(event) => event.preventDefault()}
        >
          <FormBody>
            <Field>
              <FieldLabel htmlFor={formId}>Project name</FieldLabel>
              <Input id={formId} name="projectName" required />
              <FieldDescription>Required before saving.</FieldDescription>
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
          <HoverCardTrigger render={<Button variant="link" />}>
            @ui-foundation
          </HoverCardTrigger>
          <HoverCardContent>
            <strong>UI Foundation</strong>
            <p className="text-muted-foreground">Source components with optional identity presets.</p>
          </HoverCardContent>
        </HoverCard>
      )

    case "input":
      return <Input className="preview-input" aria-label="Example input" placeholder="Enter a value…" />

    case "input-group": {
      const inputGroupId = `${id}-input-group`
      return (
        <div className="preview-form">
          <Label htmlFor={inputGroupId}>Search documentation</Label>
          <InputGroup>
            <InputGroupAddon><SearchIcon aria-hidden="true" /></InputGroupAddon>
            <InputGroupInput id={inputGroupId} placeholder="Search…" />
            <InputGroupAddon align="inline-end"><Kbd>⌘K</Kbd></InputGroupAddon>
          </InputGroup>
        </div>
      )
    }

    case "input-otp":
      return (
        <InputOTP aria-label="Verification code" maxLength={6} defaultValue="248">
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
      )

    case "item":
      return (
        <Item className="preview-wide" variant="outline">
          <ItemMedia variant="icon"><CheckCircle2Icon /></ItemMedia>
          <ItemContent>
            <ItemTitle>Registry connected</ItemTitle>
            <ItemDescription>Component source can be installed locally.</ItemDescription>
          </ItemContent>
          <ItemActions><Button size="sm" variant="outline">Inspect</Button></ItemActions>
        </Item>
      )

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
        <Marker className="w-72" variant="separator">
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
              <MenubarItem>New file <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarItem>Open</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Close</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent><MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem></MenubarContent>
          </MenubarMenu>
        </Menubar>
      )

    case "message":
      return (
        <Message className="w-72">
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
        <MessageScrollerProvider>
          <MessageScroller className="h-44 w-72 rounded-lg border">
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-3 p-3">
                {[1, 2, 3, 4].map((message) => (
                  <MessageScrollerItem key={message} scrollAnchor={message === 4}>
                    <Bubble variant={message % 2 ? "muted" : "default"} align={message % 2 ? "start" : "end"}>
                      <BubbleContent>Message {message}</BubbleContent>
                    </Bubble>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      )

    case "native-select":
      return (
        <NativeSelect aria-label="Release channel" defaultValue="stable">
          <NativeSelectOption value="stable">Stable</NativeSelectOption>
          <NativeSelectOption value="preview">Preview</NativeSelectOption>
          <NativeSelectOption value="canary">Canary</NativeSelectOption>
        </NativeSelect>
      )

    case "navigation-menu":
      return (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-72 gap-1 p-2">
                  <NavigationMenuLink href="#components">Browse catalog</NavigationMenuLink>
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
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#top" /></PaginationItem>
            <PaginationItem><PaginationLink href="#top" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#top">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis /></PaginationItem>
            <PaginationItem><PaginationNext href="#top" /></PaginationItem>
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
      return (
        <Questionnaire
          className="w-72 rounded-lg border p-4"
          items={questionnaireItems}
          shortcuts="numbers"
          onSubmit={(event) => event.preventDefault()}
        >
          <QuestionnaireProgress>Question 1 of 1</QuestionnaireProgress>
          <QuestionnaireItem name="identity" required>
            <QuestionnaireTitle>Choose an identity</QuestionnaireTitle>
            <QuestionnaireDescription>Behavior stays the same in both options.</QuestionnaireDescription>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="neutral">Neutral</QuestionnaireChoice>
              <QuestionnaireChoice value="tis">TIS</QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
          <QuestionnaireActions><QuestionnaireSubmit>Apply</QuestionnaireSubmit></QuestionnaireActions>
        </Questionnaire>
      )

    case "radio-group":
      return (
        <FieldSet className="preview-form">
          <FieldLegend variant="label">Distribution</FieldLegend>
          <RadioGroup defaultValue="source">
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
        <ScrollArea className="h-32 w-64 rounded-lg border">
          <div className="space-y-2 p-3">
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
          <span>Before</span><Separator /><span>After</span>
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
        <SidebarProvider className="h-48 min-h-0 w-72 overflow-hidden rounded-lg border" style={{ "--sidebar-width": "11rem" } as CSSProperties}>
          <Sidebar collapsible="none">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem><SidebarMenuButton isActive><MenuIcon />Components</SidebarMenuButton></SidebarMenuItem>
                    <SidebarMenuItem><SidebarMenuButton><SearchIcon />Search</SidebarMenuButton></SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Content</div>
        </SidebarProvider>
      )

    case "skeleton":
      return (
        <div className="skeleton-preview" role="status" aria-label="Loading content">
          <Skeleton className="skeleton-avatar" />
          <div><Skeleton className="skeleton-line" /><Skeleton className="skeleton-line short" /></div>
        </div>
      )

    case "slider":
      return <Slider className="w-64" defaultValue={[35]} getThumbAriaLabel={() => "Volume"} />

    case "sonner":
      return (
        <>
          <Button variant="outline" onClick={() => sonnerToast.success("Theme saved")}>Show Sonner toast</Button>
          <SonnerToaster position="bottom-right" />
        </>
      )

    case "spinner":
      return (
        <div className="preview-inline">
          <Spinner />
          <Spinner className="size-5 text-primary" aria-label="Loading preview" />
          <Button disabled><Spinner data-icon="inline-start" />Saving</Button>
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
      return <Textarea className="preview-input" aria-label="Example textarea" placeholder="Describe the intended experience…" />

    case "toast":
      return (
        <>
          <Button variant="outline" onClick={() => baseToast.add({ title: "Component installed", description: "Source files are now in your project.", type: "success" })}>
            Show Base UI toast
          </Button>
          <ToastToaster />
        </>
      )

    case "toggle":
      return (
        <Toggle aria-label="Toggle bold" defaultPressed>
          <BoldIcon />
          Bold
        </Toggle>
      )

    case "toggle-group":
      return (
        <ToggleGroup aria-label="Text formatting" defaultValue={["bold"]} multiple>
          <ToggleGroupItem aria-label="Bold" value="bold"><BoldIcon /></ToggleGroupItem>
          <ToggleGroupItem aria-label="Italic" value="italic"><ItalicIcon /></ToggleGroupItem>
          <ToggleGroupItem aria-label="Underline" value="underline"><UnderlineIcon /></ToggleGroupItem>
        </ToggleGroup>
      )

    case "tooltip":
      return (
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>Hover or focus</TooltipTrigger>
          <TooltipContent>Copied components remain editable.</TooltipContent>
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
