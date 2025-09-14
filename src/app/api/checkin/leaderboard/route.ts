import { NextRequest, NextResponse } from 'next/server'
import { getCheckinLeaderboard } from '@/lib/checkin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const leaderboard = await getCheckinLeaderboard(limit)
    
    return NextResponse.json({
      success: true,
      data: leaderboard
    })
  } catch (error) {
    console.error('获取签到排行榜API错误:', error)
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 })
  }
}