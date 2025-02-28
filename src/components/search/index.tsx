'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { DataTable } from '@/components/datatable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { searchSchema } from '@/lib/validation/search'
import type { Author, Pagination, Work } from '@/types/openalex'

export const Search = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Work[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)

  const searchAuthors = async (author: string): Promise<Author[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/authors?select=id,display_name&filter=display\_name.search:${author}`
    )

    if (!res.ok) {
      toast.error('Something went wrong!', {
        description: 'Please try again.',
      })

      return []
    }

    const json = await res.json()

    if (json?.results && json.results.length > 0) {
      return json.results
    }

    toast.error('No results found!', {
      description: 'Please adjust your search criteria and try again.',
    })

    return []
  }

  const searchWorks = async (
    page: number,
    authors: Author[],
    startYear?: string,
    endYear?: string
  ): Promise<Work[]> => {
    const authorIds = authors.map((author) => author.id?.split('/').pop()).join('|')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/works?per_page=25&page=${page}&select=id,title,type,language,publication_date,publication\_year,cited_by_count&sort=publication\_year:desc&filter=authorships.author.id:${authorIds},from\_publication\_date:${startYear || '0001'}-01-01,to\_publication\_date:${endYear ? `${endYear}` : `${new Date().getFullYear()}`}-12-31`
    )

    if (!res.ok) {
      toast.error('Something went wrong!', {
        description: 'Please try again.',
      })

      return []
    }

    const json = await res.json()

    if (json?.meta) {
      setPagination({
        count: json.meta.count,
        db_response_time_ms: json.meta.db_response_time_ms,
        groups_count: json.meta.groups_count,
        page: json.meta.page,
        per_page: json.meta.per_page,
      })
    }

    if (json?.results && json.results.length > 0) {
      return json.results
    }

    return []
  }

  const fetchData = async (page?: number) => {
    setLoading(true)

    const values = form.getValues()

    // first, search for the author
    const authors = await searchAuthors(values.author)

    if (!authors || authors.length === 0) {
      // no authors found
      setData([])
      setPagination(null)
    } else {
      // authors found
      // next, search for the works
      const works = await searchWorks(page || 1, authors, values.startYear, values.endYear)

      if (!works || works.length === 0) {
        // no works found
        setData([])
        setPagination(null)
      } else {
        // works found
        setData(works)
      }
    }

    setLoading(false)
  }

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      author: '',
      startYear: '',
      endYear: '',
    },
  })

  const onSubmit = async () => {
    fetchData(1)
  }

  const columns: ColumnDef<Work>[] = [
    {
      accessorKey: 'title',
      header: 'Title of Work',
      cell: ({ row }) => (
        <a
          href={row.original.id}
          target="_blank"
          dangerouslySetInnerHTML={{ __html: row.original.title }}
          className="text-primary line-clamp-1 min-w-[440px] capitalize hover:underline"
        />
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type of Work',
      cell: ({ row }) => {
        return (
          <Badge variant="default" className="capitalize">
            {row.original.type}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'language',
      header: 'Language',
    },
    {
      accessorKey: 'publication_date',
      header: 'Date of Publication',
      cell: ({ row }) => {
        const date = new Date(row.original.publication_date)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'UTC',
        })
      },
    },
    {
      accessorKey: 'cited_by_count',
      header: 'Times Cited',
    },
    {
      accessorKey: 'id',
      header: 'Link to Work',
      cell: ({ row }) => (
        <a
          href={row.original.id}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          {row.original.id}
        </a>
      ),
    },
  ]

  return (
    <section className="container flex w-full flex-col items-start gap-8">
      <div className="flex w-full flex-col items-start justify-items-center gap-8">
        <h2 className="text-2xl font-bold">Search</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="justify-content-center mx-auto flex w-auto w-full flex-col items-start gap-4 md:flex-row md:gap-2"
          >
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="w-full md:max-w-[280px]">
                  <FormLabel className="required">Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startYear"
              defaultValue=""
              render={({ field }) => (
                <FormItem className="w-full md:max-w-[280px]">
                  <FormLabel>Start Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Start Year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endYear"
              defaultValue=""
              render={({ field }) => (
                <FormItem className="w-full md:max-w-[280px]">
                  <FormLabel>End Year</FormLabel>
                  <FormControl>
                    <Input placeholder="End Year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex h-full flex-col items-end">
              <Label className="mb-2 hidden opacity-0 md:block">Search</Label>
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="flex w-full flex-col items-start justify-items-center gap-8">
        <DataTable
          data={data}
          fetchData={fetchData}
          columns={columns}
          loading={loading}
          pagination={pagination}
        />
      </div>
    </section>
  )
}
