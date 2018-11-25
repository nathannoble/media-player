const mediaInitialState = {
    isLoading: true,
    currentMedia: {},
    mediaList: [],
    nowPlayingList: []
}

const mediaList = (state = mediaInitialState, action) => {
    switch (action.type) {
        case 'INIT_MEDIA_LIST':
            return { ...state, mediaList: action.mediaList, currentMedia: action.mediaList[0], isLoading: false }

        // Update the current media and the corresponding item
        case 'SET_CURRENT_MEDIA':
            return { ...state, currentMedia: action.media }

        case 'SET_NOW_PLAYING_LIST':
            return { ...state, nowPlayingList: action.nowPlayingList }

        default:
            return state
    }
}

export default mediaList