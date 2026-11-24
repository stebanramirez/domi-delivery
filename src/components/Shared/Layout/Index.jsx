import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Index'
import Footer from '../Footer/Index'
import styles from './Index.module.scss'

function Layout() {
  return (
    <div className={styles.app}>
      <Navbar />
      <div className={styles.contenido}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout