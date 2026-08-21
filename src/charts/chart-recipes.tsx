import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const monthlyData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 309, mobile: 230 },
  { month: "Jun", desktop: 354, mobile: 260 },
]

const channelData = [
  { channel: "Direct", visitors: 310 },
  { channel: "Search", visitors: 245 },
  { channel: "Referral", visitors: 168 },
  { channel: "Social", visitors: 122 },
]

const capabilityData = [
  { capability: "Research", current: 82, target: 90 },
  { capability: "Design", current: 91, target: 90 },
  { capability: "Content", current: 68, target: 80 },
  { capability: "Delivery", current: 76, target: 85 },
  { capability: "Measure", current: 59, target: 75 },
]

const progressData = [{ label: "Progress", value: 72, fill: "var(--color-value)" }]

const seriesConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

const visitorConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
} satisfies ChartConfig

const pieConfig = {
  direct: { label: "Direct", color: "var(--chart-1)" },
  search: { label: "Search", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
} satisfies ChartConfig

const radarConfig = {
  current: { label: "Current", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--chart-3)" },
} satisfies ChartConfig

const radialConfig = {
  value: { label: "Progress", color: "var(--chart-1)" },
} satisfies ChartConfig

function AreaChartRecipe() {
  return (
    <>
      <ChartContainer config={seriesConfig} className="h-64 w-full aspect-auto" role="img" aria-label="Desktop and mobile visitors by month" aria-describedby="area-chart-summary">
        <AreaChart accessibilityLayer data={monthlyData} margin={{ left: 0, right: 8 }}>
          <defs>
            <linearGradient id="area-desktop-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="area-mobile-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.42} />
              <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Area dataKey="desktop" type="monotone" fill="url(#area-desktop-fill)" stroke="var(--color-desktop)" strokeWidth={2} isAnimationActive={false} />
          <Area dataKey="mobile" type="monotone" fill="url(#area-mobile-fill)" stroke="var(--color-mobile)" strokeWidth={2} isAnimationActive={false} />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
      <p className="sr-only" id="area-chart-summary">Desktop visitors rise from 186 in January to 354 in June. Mobile visitors rise from 80 to 260.</p>
    </>
  )
}

function BarChartRecipe() {
  return (
    <>
      <ChartContainer config={visitorConfig} className="h-64 w-full aspect-auto" role="img" aria-label="Visitors by acquisition channel" aria-describedby="bar-chart-summary">
        <BarChart accessibilityLayer data={channelData} layout="vertical" margin={{ left: 10, right: 8 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="channel" type="category" axisLine={false} tickLine={false} width={62} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="visitors" fill="var(--color-visitors)" radius={5} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
      <p className="sr-only" id="bar-chart-summary">Direct is the largest acquisition channel with 310 visitors, followed by Search with 245.</p>
    </>
  )
}

function LineChartRecipe() {
  return (
    <>
      <ChartContainer config={seriesConfig} className="h-64 w-full aspect-auto" role="img" aria-label="Desktop and mobile visitor trend" aria-describedby="line-chart-summary">
        <LineChart accessibilityLayer data={monthlyData} margin={{ left: 0, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={false} isAnimationActive={false} />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
      <p className="sr-only" id="line-chart-summary">Both desktop and mobile traffic trend upward between January and June.</p>
    </>
  )
}

function PieChartRecipe() {
  const data = channelData.map((item) => ({
    ...item,
    fill: `var(--color-${item.channel.toLowerCase()})`,
  }))

  return (
    <>
      <ChartContainer config={pieConfig} className="h-64 w-full aspect-auto" role="img" aria-label="Traffic share by acquisition channel" aria-describedby="pie-chart-summary">
        <PieChart accessibilityLayer>
          <ChartTooltip content={<ChartTooltipContent nameKey="channel" hideLabel />} />
          <Pie data={data} dataKey="visitors" nameKey="channel" innerRadius={52} outerRadius={90} strokeWidth={3} isAnimationActive={false} />
          <ChartLegend content={<ChartLegendContent nameKey="channel" />} />
        </PieChart>
      </ChartContainer>
      <p className="sr-only" id="pie-chart-summary">Direct represents the largest share, followed by Search, Referral and Social.</p>
    </>
  )
}

function RadarChartRecipe() {
  return (
    <>
      <ChartContainer config={radarConfig} className="h-64 w-full aspect-auto" role="img" aria-label="Current and target capability scores" aria-describedby="radar-chart-summary">
        <RadarChart accessibilityLayer data={capabilityData} outerRadius={82}>
          <PolarGrid />
          <PolarAngleAxis dataKey="capability" tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Radar dataKey="target" fill="var(--color-target)" fillOpacity={0.14} stroke="var(--color-target)" strokeWidth={2} isAnimationActive={false} />
          <Radar dataKey="current" fill="var(--color-current)" fillOpacity={0.3} stroke="var(--color-current)" strokeWidth={2} isAnimationActive={false} />
          <ChartLegend content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
      <p className="sr-only" id="radar-chart-summary">Design exceeds its target. Research is close. Content, Delivery and Measure remain below target.</p>
    </>
  )
}

function RadialChartRecipe() {
  return (
    <>
      <ChartContainer config={radialConfig} className="h-64 w-full aspect-auto" role="img" aria-label="Delivery progress at 72 percent" aria-describedby="radial-chart-summary">
        <RadialBarChart accessibilityLayer data={progressData} innerRadius={72} outerRadius={104} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" background cornerRadius={8} isAnimationActive={false} />
          <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-semibold">72%</text>
          <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">Complete</text>
        </RadialBarChart>
      </ChartContainer>
      <p className="sr-only" id="radial-chart-summary">Delivery is 72 percent complete.</p>
    </>
  )
}

export {
  AreaChartRecipe,
  BarChartRecipe,
  LineChartRecipe,
  PieChartRecipe,
  RadarChartRecipe,
  RadialChartRecipe,
}
