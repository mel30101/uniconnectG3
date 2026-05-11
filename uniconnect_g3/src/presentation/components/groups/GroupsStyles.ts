import { StyleSheet } from 'react-native';
import { UCaldasTheme } from '@/app/constants/Colors';

export const groupsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tabItem: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTabItem: {
        borderBottomColor: UCaldasTheme.dorado,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: UCaldasTheme.azulOscuro,
    },
    content: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    placeholderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: UCaldasTheme.azulOscuro,
        marginTop: 20,
    },
    placeholderSubtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
    createButton: {
        backgroundColor: UCaldasTheme.dorado,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        marginTop: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    adminContainer: {
        flex: 1,
    },
    tabHeader: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
});
