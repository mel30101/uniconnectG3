import { StyleSheet } from 'react-native';
import { UCaldasTheme } from '@/app/constants/Colors';

export const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleInfo: {
        flex: 1,
        marginRight: 10,
    },
    groupName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: UCaldasTheme.azulOscuro,
    },
    subjectName: {
        fontSize: 13,
        color: UCaldasTheme.dorado,
        fontWeight: '600',
        marginTop: 2,
    },
    adminBadge: {
        backgroundColor: UCaldasTheme.azulOscuro,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        gap: 4,
    },
    adminBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
});
