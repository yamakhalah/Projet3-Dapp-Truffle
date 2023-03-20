import { createStyles, makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

export const useStyles = makeStyles((defaultTheme) =>
    createStyles({
        gridContainer: {
            margin: '50px 0px 50px 0px !important'
        },
        gridItem: {
            backgroundColor: '#1A2027 !important',
        },
    }),
);