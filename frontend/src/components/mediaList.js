import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class MediaList extends React.Component {

    play(media) {
        media.isPlaying = true
        this.props.setMedia(media)
    }

    pause(media) {
        media.isPlaying = false
        this.props.setMedia(media)
    }

    render() {
        const { classes, media } = this.props;
        const current = media.currentMedia
        const songs = media.mediaList

        return (
            <div className={classes.root}>
                <List dense>
                    {songs.map(value => (
                        <ListItem key={value.id} button>
                            <Avatar alt="Album Art" src={'/images/' + value.albumArt} />
                            <ListItemText primary={value.title} />
                            <ListItemSecondaryAction>
                                { value.id === current.id && current.isPlaying ?
                                    <IconButton aria-label="Pause" onClick={() => this.pause(value)}>
                                        <PauseIcon />
                                    </IconButton> :
                                    <IconButton aria-label="Play" onClick={() => this.play(value)}>
                                        <PlayIcon />
                                    </IconButton>
                                }

                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}

MediaList.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        media: state.media
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMedia: media => dispatch({ type: 'SET_CURRENT_MEDIA', media: media }),
    };
};

export default withStyles(styles, { withTheme: true })(connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaList))