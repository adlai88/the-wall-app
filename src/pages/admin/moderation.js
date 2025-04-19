import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'

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
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: white;
`

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: white;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #ff5722;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #f4511e;
  }
`

const ErrorMessage = styled.div`
  color: red;
  margin: 10px 0;
  text-align: center;
`

export default function AdminModerationPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <LoadingContainer>
        <Loading>Loading...</Loading>
      </LoadingContainer>
    )
  }

  if (!session) {
    return (
      <LoginContainer>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Login</Button>
        </form>
      </LoginContainer>
    )
  }

  return (
    <AdminContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Event Moderation</h1>
        <Button 
          onClick={() => supabase.auth.signOut()} 
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          Logout
        </Button>
      </div>
      <AdminModeration />
    </AdminContainer>
  )
} 