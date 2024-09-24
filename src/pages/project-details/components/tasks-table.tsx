import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/custom/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { CreateTaskDialog } from '@/pages/project-details/components/create-task-dialog.tsx'
import { EditTaskDialog } from '@/pages/project-details/components/edit-task-dialog.tsx'
import { ProjectTaskData } from '@/pages/projects/data/schema.ts'
import { DeleteTaskDialog } from '@/pages/project-details/components/delete-task-dialog.tsx'

interface TaskTableProps {
  addDeletedTask: (id: number) => void
  addEditedTask: (id: number) => void
  tasks: ProjectTaskData[]
  setTasks: (newTasks: ProjectTaskData[]) => void
}

export default function TaskTable({
  addDeletedTask,
  tasks,
  setTasks,
  addEditedTask,
}: TaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<ProjectTaskData | null>(null)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)

  const handleEdit = (task: ProjectTaskData) => {
    setSelectedTask(task)
    addEditedTask(task.id)
    setIsEditModalOpen(true)
  }

  const handleDelete = (task: ProjectTaskData) => {
    setSelectedTask(task)
    setIsDeleteAlertOpen(true)
  }

  const deleteTask = (deletedTask: ProjectTaskData) => {
    if (deletedTask) {
      if (!(deletedTask.id < 0)) {
        addDeletedTask(deletedTask.id)
      }
      setTasks(tasks.filter((t) => t.id !== deletedTask.id))
    }
  }

  const editTask = (updatedTask: ProjectTaskData) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
    setIsEditModalOpen(false)
  }

  const createTask = (newTask: ProjectTaskData) => {
    if (newTask) {
      setTasks([...tasks, newTask])
    }
    setCreateDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>Here you can manage project's tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='container mx-auto p-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{Number(task.id) > 0 ? task.id : 'new'}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setSelectedTask(task)
                        setIsDescriptionModalOpen(true)
                      }}
                      className='text-blue-600 hover:underline'
                    >
                      {task.description.length > 45
                        ? `${task.description.substring(0, 45)}...`
                        : task.description}
                    </button>
                  </TableCell>
                  <TableCell>{task.price}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(task)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog
            open={isDescriptionModalOpen}
            onOpenChange={setIsDescriptionModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedTask?.title}</DialogTitle>
              </DialogHeader>
              <p>{selectedTask?.description}</p>
            </DialogContent>
          </Dialog>

          {selectedTask && (
            <EditTaskDialog
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              task={selectedTask as ProjectTaskData}
              editTask={editTask}
            />
          )}
          {selectedTask && (
            <DeleteTaskDialog
              isOpen={isDeleteAlertOpen}
              onClose={() => setIsDeleteAlertOpen(false)}
              task={selectedTask as ProjectTaskData}
              deleteTask={deleteTask}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className='justify-center border-t p-4'>
        <Button
          size='sm'
          variant='ghost'
          className='gap-1'
          onClick={() => setCreateDialogOpen(true)}
        >
          <PlusCircle className='h-3.5 w-3.5' />
          Add Task
        </Button>
      </CardFooter>
      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        createTask={createTask}
      />
    </Card>
  )
}
