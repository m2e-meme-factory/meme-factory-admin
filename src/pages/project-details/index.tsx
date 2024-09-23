import { string, z } from 'zod'
import { ChevronLeft, PlusCircle, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Layout } from '@/components/custom/layout.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem } from '@/components/custom/breadcrumb.tsx'
import { IconChevronRight } from '@tabler/icons-react'
import TaskTable from '@/pages/project-details/components/tasks-table.tsx'
import { useQuery } from '@tanstack/react-query'
import { getProject } from '@/data/requests/project/get-specified-project.ts'
import { useEffect, useState } from 'react'
import {
  ProjectInterface,
  ProjectStatus,
  ProjectTaskData,
} from '@/pages/projects/data/schema.ts'
import { Spinner } from '@/components/custom/spinner.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'

const editProjectSchema = z.object({
  title: z.string().min(1, 'Title must be at least 1 character long'),
  description: z
    .string()
    .min(10, 'Description must be at least 1 character long'),
  category: z.string(),
  tags: z.array(string()),
  authorId: z.string().regex(/^[1-9][0-9]*$/, {
    message: 'Author id must be a number starting from 1',
  }),
})

type EditProjectSchema = z.infer<typeof editProjectSchema>

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const BREADCRUMBS_ITEMS = [
    { title: 'Home', href: '/' },
    { title: 'Projects', href: '/projects' },
    { title: `${id}`, href: `/${id}` },
  ].map(({ href, title }) => (
    <BreadcrumbItem key={title}>
      {href ? (
        <Link className='text-muted-foreground hover:text-foreground' to={href}>
          {title}
        </Link>
      ) : (
        <span className='text-muted-foreground'>{title}</span>
      )}
    </BreadcrumbItem>
  ))

  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ProjectId invalid')
      }
      return getProject({ params: { id: Number(id) } })
    },
    enabled: !!id,
    select: (data) => {
      const projectData = data?.data || {}
      return {
        id: projectData.id,
        title: projectData.title,
        description: projectData.description,
        tags: projectData.tags,
        authorId: projectData.authorId,
        category: projectData.category,
        bannerUrl: projectData.bannerUrl,
        files: projectData.files,
        status: projectData.status as ProjectStatus,
        tasks: projectData.tasks,
      }
    },
    refetchOnWindowFocus: 'always',
  })

  const [project, setProject] = useState<ProjectInterface | null>(null)
  const [tasksData, setTasksData] = useState<ProjectTaskData[]>([])
  const [deletedTasks, setDeletedTasks] = useState<number[]>([])

  useEffect(() => {
    if (data) {
      setProject(data)
      setTasksData(data.tasks?.map((task) => task.task) || [])
    }
  }, [data])

  const addDeletedTask = (deletedTaskId: number) => {
    setDeletedTasks([deletedTaskId, ...deletedTasks])
  }

  console.log(project)

  const form = useForm<EditProjectSchema>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      authorId: '',
      tags: [],
    },
  })

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        category: project.category,
        authorId: project.authorId.toString(),
        tags: project.tags,
      })
    }
  }, [project, form])

  const resetToDefaultValues = () => {
    form.reset({
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category,
      authorId: project ? project.authorId.toString() : '',
      tags: project?.tags,
    })
  }

  const onSubmit = () => {
    console.log('submitted')
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Layout>
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mx-auto grid max-w-[80%] flex-1 auto-rows-max gap-4'>
          <div className='mb-5'>
            <Breadcrumb separator={<IconChevronRight size={18} />}>
              {BREADCRUMBS_ITEMS}
            </Breadcrumb>
          </div>

          {/* ===== Back, Discard and Save buttons ===== */}
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <Button
                onClick={() => navigate(-1)}
                variant='outline'
                size='icon'
                className='h-7 w-7'
              >
                <ChevronLeft className='h-4 w-4' />
                <span className='sr-only'>Back</span>
              </Button>
              <h1 className='whitespace-nowrap text-xl font-semibold tracking-tight'>
                Project {id}
              </h1>
            </div>
            <div className='flex items-center justify-end gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={resetToDefaultValues}
              >
                Discard
              </Button>
              <Button size='sm'>Save Project</Button>
            </div>
          </div>

          <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
            <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
              {/* ===== Project information section ===== */}
              <Card x-chunk='dashboard-07-chunk-0'>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    This section provides essential information about the
                    project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className='space-y-8'
                    >
                      <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                type='text'
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                className='h-32'
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='category'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a category' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='discord'>Discord</SelectItem>
                                <SelectItem value='medium'>Medium</SelectItem>
                                <SelectItem value='instagram'>
                                  Instagram
                                </SelectItem>
                                <SelectItem value='tiktok'>Tiktok</SelectItem>
                                <SelectItem value='youtube'>Youtube</SelectItem>
                                <SelectItem value='twitter'>Twitter</SelectItem>
                                <SelectItem value='telegram'>
                                  Telegram
                                </SelectItem>
                                <SelectItem value='facebook'>
                                  Facebook
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='tags'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value[0]}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select tags' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='video'>Video</SelectItem>
                                <SelectItem value='nft'>NFT</SelectItem>
                                <SelectItem value='post'>Post</SelectItem>
                                <SelectItem value='reels'>Reels</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='authorId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author Id</FormLabel>
                            <FormControl>
                              <Input
                                type='text'
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* ===== Banner section ===== */}
              <Card className='overflow-hidden'>
                <CardHeader>
                  <CardTitle>Project Banner</CardTitle>
                  <CardDescription>
                    Here you can view and update the project banner
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-2'>
                    <img
                      alt='Project banner'
                      className='w-full rounded-md object-cover'
                      src={
                        project
                          ? `https://api.meme-factory.site${project?.bannerUrl}`
                          : ''
                      }
                      style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
                    />
                  </div>
                </CardContent>
                <CardFooter className='justify-center border-t p-4'>
                  <Button size='sm' variant='ghost' className='gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    Change banner
                  </Button>
                </CardFooter>
              </Card>

              {/* ===== Tasks section ===== */}
              <TaskTable
                tasks={tasksData}
                addDeletedTask={addDeletedTask}
                setTasks={setTasksData}
              />
            </div>
            <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
              {/* ===== Project Status ===== */}
              <Card x-chunk='dashboard-07-chunk-3'>
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-6'>
                    <div className='grid gap-3'>
                      <Label htmlFor='status'>Status</Label>
                      <Select
                        value={project?.status}
                        onValueChange={(value) =>
                          setProject((prev) =>
                            prev
                              ? { ...prev, status: value as ProjectStatus }
                              : null
                          )
                        }
                      >
                        <SelectTrigger id='status' aria-label='Select status'>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='draft'>Draft</SelectItem>
                          <SelectItem value='published'>Published</SelectItem>
                          <SelectItem value='closed'>Closed</SelectItem>
                          <SelectItem value='moderation'>
                            On moderation
                          </SelectItem>
                          <SelectItem value='not_accepted'>Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ===== Files section ===== */}
              <Card x-chunk='dashboard-07-chunk-1'>
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>
                    You can manage and organize your project files here. Upload
                    new documents, delete the old ones, and access all your
                    files in one place.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-4/6'>Title</TableHead>
                        <TableHead>Extension</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className='font-semibold'>
                          <p className='overflow-hidden text-ellipsis'>
                            long-long-long-long-long-long-long-long-long-name
                          </p>
                        </TableCell>
                        <TableCell>
                          <p>exe</p>
                        </TableCell>
                        <TableCell>
                          <Button>
                            <Trash2 className='h-3.5 w-3.5' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className='justify-center border-t p-4'>
                  <Button size='sm' variant='ghost' className='gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    Add File
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}

export default ProjectDetails
