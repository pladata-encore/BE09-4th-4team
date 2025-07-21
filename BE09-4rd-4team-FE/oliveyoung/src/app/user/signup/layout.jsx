import SignUpHeader from '../components/SignUpHeader'
import SignUpFooter from '../components/SignUpFooter'

export default function SignUpLayout({ children }) {
  return (
    <>
      <SignUpHeader />
      {children}
      <SignUpFooter />
    </>
  )
}
