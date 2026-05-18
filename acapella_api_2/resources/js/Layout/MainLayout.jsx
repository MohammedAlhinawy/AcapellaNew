import { usePage } from '@inertiajs/react';
import Nav from './Nav';
import Footer from './Footer';
import BottomPlayer from '../Components/BottomPlayer';
import PropTypes from 'prop-types';

export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const isGuest = !auth?.user;

    return (
        <div className="main-layout">
            <Nav />
            <main className="main-content">
                {children}
            </main>
            {isGuest && <Footer />}
            <BottomPlayer />
        </div>
    );
}

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
