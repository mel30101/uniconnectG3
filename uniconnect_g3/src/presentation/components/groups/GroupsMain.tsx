import React from 'react';
import { useWindowDimensions } from 'react-native';
import { MobileGroupView } from './MobileGroupView';
import { DesktopGroupDashboard } from './DesktopGroupDashboard';

export default function GroupsMain() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;

    if (isDesktop) {
        return <DesktopGroupDashboard />;
    }

    return <MobileGroupView />;
}
