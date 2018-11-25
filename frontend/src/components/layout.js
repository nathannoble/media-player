import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AppIcon from '@material-ui/icons/MusicNote';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MediaList from '../components/mediaList';
import MediaControl from './mediaControl';
import NowPlayingList from './nowPlayingList';
import * as config from '../config';
import openSocket from 'socket.io-client';
import nowPlayingList from './nowPlayingList';

const drawerWidth = 340;

const styles = theme => ({
    typography: {
        useNextVariants: true,
    },
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});

class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            userId: null
        };
        this.fetchMediaList = this.fetchMediaList.bind(this)
        this.socket = openSocket(config.WS_SERVICE)

        this.socket.on('welcome', (uuid) => {
            if (this.state.userId) return
            this.setState({ userId: uuid })
        });

        var self = this
        this.socket.on('nowPlayingListChanged', (data) => {
            
            if(data.length === 0) {
                this.props.setNowPlayingList([])
                return
            }

            // Sanitize the data here
            // Remove those from this user
            var temp = data.filter(d => d.userId !== this.state.userId)
            // Remove duplicate mediaId
            temp = temp.filter((o, index, self) =>
                index === self.findIndex((m) => (
                    m.id === o.id
                ))
            )

            console.log(temp)

            this.props.setNowPlayingList(temp)
        });
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    //////////////
    // API Calls
    ////////////
    fetchMediaList = () => {
        fetch(config.META_SERVICE + 'songs')
            .then(response => response.json())
            .then(data => {
                this.props.initMediaList(data)
            });
    }

    componentDidMount() {
        this.fetchMediaList()
    }

    render() {
        const { classes, theme } = this.props;
        const { open, userId } = this.state;
        const socket = this.socket;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar disableGutters={!open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <AppIcon className={classes.icon} />
                        <Typography variant="h6" color="inherit" noWrap>
                            Media Player
            </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <MediaList></MediaList>

                    <Divider />
                    <Typography noWrap>
                        Others are currently playing...
                    </Typography>
                    <NowPlayingList></NowPlayingList>
                </Drawer>
                <main
                    className={classNames(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />
                    <MediaControl socket={socket} userId={userId}></MediaControl>
                </main>
            </div>
        );
    }
}

Layout.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    console.log(state);
    return {

    }
}

const mapDispatchToProps = dispatch => {
    return {
        initMediaList: mediaList => dispatch({ type: 'INIT_MEDIA_LIST', mediaList: mediaList }),
        setNowPlayingList: nowPlayingList => dispatch({ type: 'SET_NOW_PLAYING_LIST', nowPlayingList: nowPlayingList }),
    };
};

export default withStyles(styles, { withTheme: true })(connect(
    mapStateToProps,
    mapDispatchToProps
)(Layout))