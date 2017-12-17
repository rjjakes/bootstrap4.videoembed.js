(function ($) {

    $.fn.VideoEmbed = function () {

        // Separate scope for each iteration.
        return this.each(function () {
            // Get autoplay setting.
            let autoplay = 'false'
            if ($(this).attr('data-autoplay')) {
                autoplay = $(this).attr('data-autoplay')
            }

            // Carry on.
            let videoLink = $(this).attr('href')
            let cleanVideoID
            let videoEmbedLink
            let previewImageUrl

            if (videoLink.match(/(youtube.com)/)) {
                cleanVideoID = videoLink.split('v=')[1].replace(/(&)+(.*)/, '')
            }
            else if (videoLink.match(/(youtu.be)/) || videoLink.match(/(vimeo.com\/)+[0-9]/)) {
                cleanVideoID = videoLink.split('/')[3].replace(/(&)+(.*)/, '')
            }
            else if (videoLink.match(/(vimeo.com\/)+[a-zA-Z]/)) {
                cleanVideoID = videoLink.split('/')[5].replace(/(&)+(.*)/, '')
            }

            if (videoLink.match(/(youtu.be)/) || videoLink.match(/(youtube.com)/)) {
                videoEmbedLink = `https://www.youtube.com/embed/${cleanVideoID}?autoplay=${autoplay.autoplay}`
                previewImageUrl = `https://img.youtube.com/vi/${cleanVideoID}/hqdefault.jpg`

                // get and insert the thumbnail
                $(this).html(`<img class="embedded-video-thumbnail" src="${previewImageUrl}" alt=""></a>`)
            }
            else if (videoLink.match(/(vimeo.com\/)+[0-9]/) || videoLink.match(/(vimeo.com\/)+[a-zA-Z]/)) {
                videoEmbedLink = `https://player.vimeo.com/video/${cleanVideoID}?autoplay=${autoplay.autoplay}`
                let saveThis = this    // save a reference to this

                // For vimeo, we have to call the API to get the image URL
                fetch(`http://vimeo.com/api/v2/video/${cleanVideoID}.json`)
                .then(response => {
                    if (response.ok) {
                        // Vimeo returns a JSON response.
                        return response.json()
                    }
                })
                .then(responseJson => {
                    // Decode the response to get the preview image URL.
                    try {
                        previewImageUrl = responseJson.pop()['thumbnail_large']
                        $(saveThis).html(`<img class="embedded-video-thumbnail" src="${previewImageUrl}" alt="" />`)
                    } catch (e) {
                        console.log(`Error: Unable to fetch thumbnail from Vimeo.`)
                    }
                })
                .catch(error => {
                    console.log(`Error: ${error.message}`)
                })

            }

            // Add bootstrap 4 modal.
            $(this).attr('data-toggle', 'modal')
            $(this).attr('data-target', '#videomodal')

            // Click handler.
            $(this).click(e => {
                let widthType = 'innerWidth',
                    width

                if (!('innerWidth' in window )) {
                    widthType = 'clientWidth'
                    window = document.documentElement || document.body
                }
                width = window[widthType]

                // Larger devices open the modal.
                if (width > 767) {
                    e.preventDefault()
                    let appendBody = `
                    <div class="modal fade" id="videomodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"> 
                        <div class="modal-dialog" role="document"> 
                            <div class="modal-content"> 
                                <div class="modal-header"> 
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>  
                                </div> 
                                <div class="modal-body"> 
                                    <div class="VideoEmbed-Wrap VideoEmbed-animation">
                                        <div class="VideoEmbed-Content">
                                            <span class="VideoEmbed-Close"></span>
                                            <iframe src="${videoEmbedLink}" allowfullscreen></iframe>
                                        </div>
                                    </div> 
                                </div> 
                            </div> 
                            <div class="modal-footer"> 
                            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button> 
                        </div> 
                    </div>
                    `

                    // Add the modal template to the body.
                    $('body').append(appendBody)

                    $('#videomodal').on('hidden.bs.modal', () => {
                        $('#videomodal').remove()
                    })

                } else {
                    // Mobile and small tablet just open the video.
                    window.location.href = videoLink
                }
            })
        })
    }

}(jQuery))