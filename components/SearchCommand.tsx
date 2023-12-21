"use client"
import { useEffect, useState } from "react"
import { File } from "lucide-react"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useSearch } from "@/hooks/useSearch"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

const SearchCommand = () => {
  const { user } = useUser()
  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  const onSelect = (documentId: Id<"documents">) => {
    router.push(`/documents/${documentId}`)
    onClose()
  }
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle])
  useEffect(() => setIsMounted(true), [])
  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose} >
      <CommandInput placeholder={`Search ${user?.fullName}'s Sotion`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default SearchCommand