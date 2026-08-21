import { MoreHorizontalIcon, PlusIcon } from "lucide-react"

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TeamMember {
  email: string
  initials: string
  name: string
  role: string
  status: "active" | "invited" | "offline"
}

interface TeamMembersProps {
  members?: TeamMember[]
  onInvite?: () => void
  onMemberAction?: (member: TeamMember) => void
}

const defaultMembers: TeamMember[] = [
  { name: "Ana Martins", email: "ana@example.com", initials: "AM", role: "Admin", status: "active" },
  { name: "David Costa", email: "david@example.com", initials: "DC", role: "Editor", status: "active" },
  { name: "Marta Silva", email: "marta@example.com", initials: "MS", role: "Viewer", status: "invited" },
]

function TeamMembers({ members = defaultMembers, onInvite, onMemberAction }: TeamMembersProps) {
  return (
    <Card aria-labelledby="team-members-title">
      <CardHeader>
        <CardTitle><h2 id="team-members-title">Team members</h2></CardTitle>
        <CardDescription>Manage access and responsibilities.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        {members.map((member) => (
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 rounded-lg px-2 py-3 hover:bg-muted/60" key={member.email}>
            <Avatar>
              <AvatarFallback>{member.initials}</AvatarFallback>
              {member.status === "active" ? <AvatarBadge><span className="sr-only">Active</span></AvatarBadge> : null}
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{member.name}</div>
              <div className="truncate text-xs text-muted-foreground">{member.email}</div>
            </div>
            <Badge variant="outline">{member.status === "invited" ? "Invited" : member.role}</Badge>
            <Button type="button" variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`} onClick={() => onMemberAction?.(member)}>
              <MoreHorizontalIcon />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" className="mt-2 w-full" onClick={onInvite}>
          <PlusIcon data-icon="inline-start" />
          Invite member
        </Button>
      </CardContent>
    </Card>
  )
}

export { TeamMembers, type TeamMember, type TeamMembersProps }
