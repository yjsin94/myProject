import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { jsx, css } from '@emotion/css'
import styled from '@emotion/styled'
// *** Mui import
import { useTheme } from '@mui/material/styles'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// *** Firebase
import { collection, getDocs, query } from 'firebase/firestore'
import db from 'src/firebase/db'

// 스타일 영역
const SampleButton3 = theme => css`
  background-color: ${theme.palette.primary.main};
  color: #fff;
  font-size: 18px;
`

const DataGridBox = styled(Box)(({ theme }) => {
  return {
    '.MuiDataGrid-root': {
      '.MuiTextField-root': {
        width: '100%',
        '.MuiInput-underline': {
          padding: '0.6rem 1rem',
          backgroundColor: theme.palette.white.dark,
          '> input': {
            paddingLeft: '1rem',
            '&:placeholder': {
              color: theme.palette.primary.main
            }
          }
        }
      }
    }
  }
})

const columns = [
  {
    field: 'no',
    headerName: 'No',
    flex: 0.2
  },
  {
    field: 'title',
    headerName: '제목',
    flex: 1.5
  },
  {
    field: 'contents',
    headerName: '내용',
    flex: 2.5
  },
  {
    field: 'author',
    headerName: '작성자',
    flex: 0.5
  },
  {
    field: 'created_at',
    headerName: '작성시간',
    flex: 1
  }
]

const Noticeboard = () => {
  const theme = useTheme()
  const [list, setList] = useState([])

  useEffect(() => {
    getDocs(query(collection(db, 'articles'))).then(results => {
      const newList = []
      const docs = results.docs.map(doc => {
        return { ...doc.data().data, id: doc.id }
      })
      docs.forEach((doc, index) => {
        newList.push({ ...doc, no: index + 1, id: doc.id })
      })
      setList(newList)
      // console.log(list)
    })
  }, [])

  return (
    <div className='w-full mt-10'>
      <div className='w-full flex justify-between items-center'>
        <p className='text-3xl font-bold'>Noticeboard</p>
        <Link href='/noticeboard/create'>
          <a>
            <Button variant='contained' className={SampleButton3(theme)}>
              글쓰기
            </Button>
          </a>
        </Link>
      </div>
      <DataGridBox sx={{ height: 'calc(100vh - 280px)', width: '100%', mt: 5 }}>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          rows={list}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 }
            }
          }}
        />
      </DataGridBox>
    </div>
  )
}

export default Noticeboard
