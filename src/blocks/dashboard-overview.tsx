import { ActivityIcon, ArrowUpRightIcon, CircleDollarSignIcon, UsersIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DashboardMetric {
  change: string
  label: string
  value: string
}

interface DashboardActivity {
  actor: string
  detail: string
  status: string
}

interface DashboardOverviewProps {
  activities?: DashboardActivity[]
  metrics?: DashboardMetric[]
  title?: string
}

const defaultMetrics: DashboardMetric[] = [
  { label: "Active users", value: "12,480", change: "+12.5%" },
  { label: "Revenue", value: "$84,240", change: "+8.2%" },
  { label: "Completion", value: "91.8%", change: "+3.1%" },
]

const defaultActivities: DashboardActivity[] = [
  { actor: "Ana Martins", detail: "Published the onboarding flow", status: "Complete" },
  { actor: "David Costa", detail: "Updated the service dashboard", status: "In review" },
  { actor: "Marta Silva", detail: "Created a research summary", status: "Draft" },
]

const trendData = [
  { month: "Jan", total: 38 },
  { month: "Feb", total: 52 },
  { month: "Mar", total: 49 },
  { month: "Apr", total: 67 },
  { month: "May", total: 73 },
  { month: "Jun", total: 88 },
]

const chartConfig = {
  total: { label: "Active users", color: "var(--chart-1)" },
}

const metricIcons = [UsersIcon, CircleDollarSignIcon, ActivityIcon]

function DashboardOverview({
  activities = defaultActivities,
  metrics = defaultMetrics,
  title = "Overview",
}: DashboardOverviewProps) {
  return (
    <section className="grid gap-4" aria-labelledby="dashboard-overview-title">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="dashboard-overview-title" className="font-heading text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">A current view of product performance.</p>
        </div>
        <Button>
          View report
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {metrics.map((metric, index) => {
          const Icon = metricIcons[index % metricIcons.length]
          return (
            <Card key={metric.label} size="sm">
              <CardHeader>
                <CardDescription>{metric.label}</CardDescription>
                <CardAction><Icon className="size-4 text-muted-foreground" aria-hidden="true" /></CardAction>
                <CardTitle className="text-2xl">{metric.value}</CardTitle>
              </CardHeader>
              <CardContent><Badge variant="secondary">{metric.change}</Badge></CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Adoption trend</CardTitle>
            <CardDescription>Active users over the last six months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full aspect-auto" role="img" aria-label="Active users over six months">
              <AreaChart accessibilityLayer data={trendData} margin={{ left: 0, right: 8 }}>
                <defs>
                  <linearGradient id="dashboard-overview-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.42} />
                    <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Area dataKey="total" type="monotone" fill="url(#dashboard-overview-fill)" stroke="var(--color-total)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest changes across the workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table aria-label="Recent workspace activity">
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={`${activity.actor}-${activity.detail}`}>
                    <TableCell>
                      <div className="font-medium">{activity.actor}</div>
                      <div className="max-w-52 truncate text-xs text-muted-foreground">{activity.detail}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{activity.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export { DashboardOverview, type DashboardActivity, type DashboardMetric, type DashboardOverviewProps }
