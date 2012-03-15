<li attr="id" _id="item-${id}" class="item">
  <div class="front">
    <h2><a _href="#item-${id}" attr="href" html="${title}">Sample</a></h2>
    <img _src="${media:thumbnail.url}" _alt="${title}" attr="src alt"/>
    <p class="author">by <span html="${author.name}">author</span></p>
    <p class="published">published <span html="${published|date}">date</span></p>
    <p class="synopsis" html="${content.content|striptags}">synopsis</p>
    <ul class="actions clearfix">
      <li class="alternate"><a class="btn" attr="href title" _href="${href}" _title="Watch ${title} on Vodo.net site (duration: ${duration|secondsToMinutes})">Watch <span html="[${format.duration|secondsToMinutes}]">[102 min]</span></a></li>
      <li class="enclosure"><a class="btn" attr="href title" _href="${href}" _title="Download ${title} torrent (size: ${size|bytesToSize})">Download <span html="[${format.size|bytesToSize}]">[652 MB]</span></a></li>
      <li class="license"><a class="btn" attr="href title" _href="${href}" _title="Read ${title} license (${rights})">License</a></li>
    </ul>
    <a class="info"><em>info</em></a>
  </div>
  <div class="back">
    <dl class="synopsis">
      <dt>synopsis</dt>
      <dd html="${content.content|striptags}">synopsis</dd>
    </dl>
    <dl class="metadata clearfix">
      <dt>aspect ratio</dt>
      <dd html="${format.pixel_aspect_ratio}">n/a</dd>
      <dt>video bitrate</dt>
      <dd html="${format.video_bitrate}">n/a</dd>
      <dt>audio bitrate</dt>
      <dd html="${format.audio_bitrate}">n/a</dd>
      <dt>audio codec</dt>
      <dd html="${format.audio_codec}">n/a</dd>
      <dt>video codec</dt>
      <dd html="${format.video_codec}">n/a</dd>            
      <dt>framerate</dt>
      <dd html="${format.framerate}">n/a</dd>
      <dt>samplerate</dt>
      <dd html="${format.samplerate}">n/a</dd>
      <dt>height</dt>
      <dd html="${format.height}">n/a</dd>
      <dt>width</dt>
      <dd html="${format.width}">n/a</dd>
    </dl>
    <a class="info"><em>info</em></a>
  </div>
</li>