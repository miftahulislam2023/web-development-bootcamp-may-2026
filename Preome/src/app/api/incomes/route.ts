import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = { userId: session.userId }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const incomes = await prisma.income.findMany({
      where,
      orderBy: {
        date: 'desc'
      }
    })
    
    return NextResponse.json(incomes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch incomes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, source, date } = body
    
    const income = await prisma.income.create({
      data: {
        amount: parseFloat(amount),
        source,
        date: new Date(date),
        userId: session.userId
      }
    })
    
    return NextResponse.json(income, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create income' }, { status: 500 })
  }
}