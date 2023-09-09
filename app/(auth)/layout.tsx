const AuthLayout = ({
  children
} : { children: React.ReactNode}) => {
  return (
    <div className="w-full h-full bg-pink-300">
      {children}
    </div>
  )
}

export default AuthLayout
