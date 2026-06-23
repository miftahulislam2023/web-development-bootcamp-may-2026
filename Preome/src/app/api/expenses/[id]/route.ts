import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { amount, description, category, date } = body
    
    const expense = await prisma.expense.updateMany({
      where: {
        id: id,
        userId: session.userId
      },
      data: {
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date)
      }
    })
    
    if (expense.count === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Expense updated successfully' })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const expense = await prisma.expense.delete({
      where: {
        id: id
      }
    })
    
    return NextResponse.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}