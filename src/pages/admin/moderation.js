import dynamic from 'next/dynamic'
import styled from 'styled-components'

// Dynamically import AdminModeration with proper loading state
const AdminModeration = dynamic(() => import('../../components/admin/AdminModeration.js'), {
  ssr: false,
  loading: () => (
    <LoadingContainer>
      <Loading>Loading admin panel...</Loading>
    </LoadingContainer>
  )
})

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
`

const Loading = styled.div`
  font-size: 1.2rem;
  color: #666;
`

const AdminContainer = styled.div`
  min-height: 100vh;
  background: white;
`

export default function AdminModerationPage() {
  return (
    <AdminContainer>
      <AdminModeration />
    </AdminContainer>
  )
} 