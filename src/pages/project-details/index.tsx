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
import { ChangeEvent, useEffect, useRef, useState } from 'react'
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
import { MultiSelect } from '@/pages/project-details/components/multiple-select.tsx'
import 'quill/dist/quill.bubble.css'
import { useQuill } from 'react-quilljs'
import { extractFileNameAndExtension } from '@/lib/utils.ts'
import { useToast } from '@/components/ui/use-toast.ts'
import { CreateTaskDto, PatchProjectDto } from '@/types/api'

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
  const { toast } = useToast()

  const bannerInputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { quill, quillRef } = useQuill({
    theme: 'bubble',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
      ],
    },
  })

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
  const [currentFiles, setCurrentFiles] = useState<string[]>([])
  const [currentProjectStatus, setCurrentProjectStatus] =
    useState<ProjectStatus | null>()
  const [currentBannerUrl, setCurrentBannerUrl] = useState<string | null>()
  const [tasksData, setTasksData] = useState<ProjectTaskData[]>([])
  const [deletedTasks, setDeletedTasks] = useState<number[]>([])
  const [editedTasks, setEditedTasks] = useState<number[]>([])

  useEffect(() => {
    if (data) {
      setProject(data)
      setTasksData(data.tasks?.map((task) => task.task) || [])
    }
  }, [data])

  useEffect(() => {
    if (quill && project) {
      quill.root.innerHTML = project.description || ''
    }
  }, [quill, project])

  const addDeletedTask = (deletedTaskId: number) => {
    setDeletedTasks([deletedTaskId, ...deletedTasks])
  }

  const addEditedTask = (editedTaskId: number) => {
    if (!editedTasks.includes(editedTaskId)) {
      setEditedTasks([editedTaskId, ...editedTasks])
    }
  }

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
    if (quill) {
      quill.on('text-change', () => {
        form.setValue('description', quill.root.innerHTML)
      })
    }
  }, [quill, form])

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        category: project.category,
        authorId: project.authorId.toString(),
        tags: project.tags,
      })

      setCurrentBannerUrl(project.bannerUrl)
      setCurrentFiles(project.files)
      setCurrentProjectStatus(project.status as ProjectStatus)
    }
  }, [project, form])

  const resetToDefaultValues = () => {
    if (project) {
      form.reset({
        title: project?.title || '',
        description: project?.description || '',
        category: project?.category,
        authorId: project ? project.authorId.toString() : '',
        tags: project?.tags,
      })
      setCurrentProjectStatus(project.status as ProjectStatus)
      setCurrentBannerUrl(project.bannerUrl)
      setCurrentFiles(project.files)
      setDeletedTasks([])
      setTasksData(project.tasks?.map((task) => task.task) || [])
    }
  }

  const handleAddBannerClick = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click()
    }
  }

  const handleBannerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCurrentBannerUrl(file.name)
    }
  }

  const handleAddFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileNames: string[] = []
      for (let i = 0; i < files.length; i++) {
        const currentFile = files.item(i)
        if (currentFile) {
          fileNames.push(currentFile.name)
        }
      }
      setCurrentFiles((prevState) => {
        const filesToAdd = Array.isArray(fileNames) ? fileNames : [fileNames]
        const uniqueFiles = filesToAdd.filter(
          (file) => !prevState.includes(file)
        )
        return [...prevState, ...uniqueFiles]
      })
    }
  }

  const handleDeleteFile = (fileToDelete: string) => {
    setCurrentFiles((prevState) =>
      prevState.filter((file) => file !== fileToDelete)
    )
  }

  const onSubmit = (values: EditProjectSchema) => {
    const checkedData = editProjectSchema.safeParse(values)
    if (checkedData.success) {
      const formData = checkedData.data
      const newTasks: CreateTaskDto[] = []

      tasksData.forEach((task) => {
        if (task.id <= 0) {
          newTasks.push({
            title: task.title,
            description: task.description,
            price: Number(task.price),
          })
        } else if (editedTasks.includes(task.id)) {
          newTasks.push({
            id: task.id,
            title: task.title,
            description: task.description,
            price: Number(task.price),
          })
        }
      })

      const editedProject: PatchProjectDto = {
        title: formData.title,
        description: formData.description,
        bannerUrl: currentBannerUrl || '',
        files: currentFiles,
        tags: formData.tags,
        category: formData.category,
        subtasks: newTasks.length > 0 ? newTasks : [],
        deletedTasks: deletedTasks,
      }

      console.log(editedProject)
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Transaction data is invalid',
      })
    }
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
              <Button onClick={form.handleSubmit(onSubmit)} size='sm'>
                Save Project
              </Button>
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
                        render={() => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <div className='h-fit rounded-md border'>
                                <div ref={quillRef} />
                              </div>
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
                        render={() => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <MultiSelect<EditProjectSchema>
                                name='tags'
                                control={form.control}
                                title='Select tags'
                                options={[
                                  { label: 'Video', value: 'video' },
                                  { label: 'NFT', value: 'nft' },
                                  { label: 'Post', value: 'post' },
                                  { label: 'Reels', value: 'reels' },
                                ]}
                              />
                            </FormControl>
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
                          ? `https://api.meme-factory.site${currentBannerUrl}`
                          : ''
                      }
                      style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
                    />
                  </div>
                </CardContent>
                <CardFooter className='justify-center border-t p-4'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='gap-1'
                    onClick={handleAddBannerClick}
                  >
                    <PlusCircle className='h-3.5 w-3.5' />
                    Change banner
                  </Button>
                  <input
                    type='file'
                    ref={bannerInputRef}
                    className='hidden'
                    onChange={handleBannerChange}
                    accept='image/*'
                  />
                </CardFooter>
              </Card>

              {/* ===== Tasks section ===== */}
              <TaskTable
                tasks={tasksData}
                addDeletedTask={addDeletedTask}
                addEditedTask={addEditedTask}
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
                        value={currentProjectStatus as ProjectStatus}
                        onValueChange={(value) =>
                          setCurrentProjectStatus(value as ProjectStatus)
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
                      {currentFiles &&
                        currentFiles.map((file) => (
                          <TableRow key={file.slice(0, 36)}>
                            <TableCell className='font-semibold'>
                              <p className='overflow-hidden text-ellipsis'>
                                {extractFileNameAndExtension(file)?.filename ||
                                  ''}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p>
                                {extractFileNameAndExtension(file)?.extension ||
                                  ''}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleDeleteFile(file)
                                }}
                              >
                                <Trash2 className='h-3.5 w-3.5' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className='justify-center border-t p-4'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='gap-1'
                    onClick={handleAddFileClick}
                  >
                    <PlusCircle className='h-3.5 w-3.5' />
                    Add File
                  </Button>
                  <input
                    type='file'
                    ref={fileInputRef}
                    className='hidden'
                    onChange={handleFileChange}
                    multiple
                  />
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
