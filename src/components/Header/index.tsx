import Input from "../Input"

function Header() {
  return (
    <header className="app_header">
      <div></div>
      <Input type={""} props={undefined} action={function (): void {
        throw new Error("Function not implemented.")
      } }/>
      <div></div>
      <div></div>
      <div></div>
    </header>
)
}
export default Header