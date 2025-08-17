import React from 'react'
import PropTypes from 'prop-types'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

const RankTable = ({ data }) => {
  const commonColumnProps = {
    sortable: true,
    resizable: true,
    lockVisible: true,
    lockPosition: true
  }

  const columnDefs = [
    {
      headerName: 'Profile',
      children: [
        {
          headerName: 'Name',
          field: 'name',
          width: 150,
          ...commonColumnProps,
          pinned: 'left'
        },
        {
          headerName: 'Username',
          field: 'userName',
          width: 150,
          ...commonColumnProps,
          pinned: 'left'
        },
        {
          headerName: 'Batch',
          field: 'batch',
          width: 120,
          filter: true,
          ...commonColumnProps,
          pinned: 'left'
        }
      ]
    },
    {
      headerName: 'Solved',
      children: [
        {
          headerName: 'Total',
          field: 'totalSolved',
          width: 90,
          ...commonColumnProps
        },
        {
          headerName: 'Easy',
          field: 'easySolved',
          width: 90,
          ...commonColumnProps
        },
        {
          headerName: 'Medium',
          field: 'mediumSolved',
          width: 110,
          ...commonColumnProps
        },
        {
          headerName: 'Hard',
          field: 'hardSolved',
          width: 90,
          ...commonColumnProps
        }
      ]
    },
    {
      headerName: 'Contest',
      children: [
        {
          headerName: 'Rating',
          field: 'globalContestRating',
          width: 100,
          ...commonColumnProps
        },
        {
          headerName: 'Ranking',
          field: 'globalContestRanking',
          width: 110,
          ...commonColumnProps
        },
        {
          headerName: 'Top Percentage',
          field: 'contestTopPercentage',
          width: 150,
          ...commonColumnProps
        },
        {
          headerName: 'Attended',
          field: 'attendedContestCount',
          width: 120,
          ...commonColumnProps
        },
        {
          headerName: 'Best Rank',
          field: 'bestContestRank',
          width: 120,
          ...commonColumnProps
        },
        {
          headerName: 'Avg Rank',
          field: 'averageContestRanking',
          width: 120,
          ...commonColumnProps
        },
        {
          headerName: 'Solved Question',
          children: [
            {
              headerName: '4',
              field: 'mostFourQuestionsInContest',
              width: 65,
              ...commonColumnProps
            },
            {
              headerName: '3',
              field: 'mostThreeQuestionsInContest',
              width: 65,
              ...commonColumnProps
            },
            {
              headerName: '2',
              field: 'mostTwoQuestionsInContest',
              width: 65,
              ...commonColumnProps
            },
            {
              headerName: '1',
              field: 'mostOneQuestionsInContest',
              width: 65,
              ...commonColumnProps
            },
            {
              headerName: '0',
              field: 'mostZeroQuestionsInContest',
              width: 65,
              ...commonColumnProps
            }
          ]
        }
      ]
    },
    {
      headerName: 'Question Ranking',
      field: 'questionRanking',
      width: 160,
      ...commonColumnProps
    },
    {
      headerName: 'Reputation',
      field: 'reputation',
      width: 130,
      ...commonColumnProps
    },
    {
      headerName: 'Badge Count',
      field: 'badgeCount',
      width: 140,
      ...commonColumnProps
    },
    {
      headerName: 'Total Active Days',
      field: 'totalActiveDays',
      width: 150,
      ...commonColumnProps
    },
    {
      headerName: 'Best Streak',
      field: 'bestStreak',
      width: 130,
      ...commonColumnProps
    }
  ]

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        rowSelection={'multiple'}
      />
    </div>
  )
}

RankTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default RankTable
