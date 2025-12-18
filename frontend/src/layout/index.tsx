import type { FunctionComponent, PropsWithChildren } from 'react'
import './index.css'

export function Layout(props: PropsWithChildren) {
  // Simplemente devolvemos el contenido hijo (nuestra pagina Matrix)
  // Sin logos, sin headers extra, sin nada.
  return (
    <>
      {props.children}
    </>
  )
}

export function withLayout<T extends FunctionComponent<any>>(Component: T, Custom?: FunctionComponent) {
  function Wither(props: any) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    )
  }
  return Custom || Wither
}