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
    const { amount, source, date } = body
    
    const income = await prisma.income.updateMany({
      where: {
        id: id,
        userId: session.userId
      },
      data: {
        amount: parseFloat(amount),
        source,
        date: new Date(date)
      }
    })
    
    if (income.count === 0) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Income updated successfully' })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update income' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const income = await prisma.income.delete({
      where: {
        id: id
      }
    })
    
    return NextResponse.json({ message: 'Income deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 })
  }
}