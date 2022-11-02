import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css'



const navigationRoutes = ['home', 'admin', 'dashboard', 'login'];

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className={ styles.nav_container }>
      {navigationRoutes.map((singleRoute) => {
        return (
          <NavigationLink
            key={singleRoute}
            href={`/${singleRoute}`}
            text={singleRoute.toUpperCase()}
            router={router}
          />
        );
      })}
    </nav>
  );
}

function NavigationLink({ href, text, router }:{href: string, text: string, router: any}) {
  const isActive = router.asPath === (href === '/home' ? '/' : href);
  return (
    <Link href={href === '/home' ? '/' : href} passHref>
      <a
        href={href === '/home' ? '/' : href}
        className={`${isActive && 'nav_item_active'} nav_item`}
      >
        {text}
      </a>
    </Link>
  );
}
