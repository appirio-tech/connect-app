/**
 * FileIcon component
 *
 * Renders file icon depend on the file type
 */
import React from 'react'
import PT from 'prop-types'

import IconDefault from '../assets/icons/default.svg'
import IconAac from '../assets/icons/aac.svg'
import IconAi from '../assets/icons/ai.svg'
import IconAse from '../assets/icons/ase.svg'
import IconAsp from '../assets/icons/asp.svg'
import IconAspx from '../assets/icons/aspx.svg'
import IconAvi from '../assets/icons/avi.svg'
import IconBmp from '../assets/icons/bmp.svg'
import IconCpp from '../assets/icons/c++.svg'
import IconCad from '../assets/icons/cad.svg'
import IconCfm from '../assets/icons/cfm.svg'
import IconCgi from '../assets/icons/cgi.svg'
import IconCsh from '../assets/icons/csh.svg'
import IconCss from '../assets/icons/css.svg'
import IconCsv from '../assets/icons/csv.svg'
import IconDmg from '../assets/icons/dmg.svg'
import IconDoc from '../assets/icons/doc.svg'
import IconDocx from '../assets/icons/docx.svg'
import IconEps from '../assets/icons/eps.svg'
import IconEpub from '../assets/icons/epub.svg'
import IconExe from '../assets/icons/exe.svg'
import IconFlash from '../assets/icons/flash.svg'
import IconFlv from '../assets/icons/flv.svg'
import IconFont from '../assets/icons/font.svg'
import IconGif from '../assets/icons/gif.svg'
import IconGpx from '../assets/icons/gpx.svg'
import IconGzip from '../assets/icons/gzip.svg'
import IconHtml from '../assets/icons/html.svg'
import IconIcs from '../assets/icons/ics.svg'
import IconIso from '../assets/icons/iso.svg'
import IconJar from '../assets/icons/jar.svg'
import IconJava from '../assets/icons/java.svg'
import IconJpg from '../assets/icons/jpg.svg'
import IconJs from '../assets/icons/js.svg'
import IconJsp from '../assets/icons/jsp.svg'
import IconLog from '../assets/icons/log.svg'
import IconMax from '../assets/icons/max.svg'
import IconMd from '../assets/icons/md.svg'
import IconMkv from '../assets/icons/mkv.svg'
import IconMov from '../assets/icons/mov.svg'
import IconMp3 from '../assets/icons/mp3.svg'
import IconMp4 from '../assets/icons/mp4.svg'
import IconMpg from '../assets/icons/mpg.svg'
import IconObj from '../assets/icons/obj.svg'
import IconOtf from '../assets/icons/otf.svg'
import IconPdf from '../assets/icons/pdf.svg'
import IconPhp from '../assets/icons/php.svg'
import IconPng from '../assets/icons/png.svg'
import IconPptx from '../assets/icons/pptx.svg'
import IconPsd from '../assets/icons/psd.svg'
import IconPy from '../assets/icons/py.svg'
import IconRar from '../assets/icons/rar.svg'
import IconRaw from '../assets/icons/raw.svg'
import IconRb from '../assets/icons/rb.svg'
import IconRss from '../assets/icons/rss.svg'
import IconRtf from '../assets/icons/rtf.svg'
import IconSketch from '../assets/icons/sketch.svg'
import IconSql from '../assets/icons/sql.svg'
import IconSrt from '../assets/icons/srt.svg'
import IconSvg from '../assets/icons/svg.svg'
import IconTif from '../assets/icons/tif.svg'
import IconTiff from '../assets/icons/tiff.svg'
import IconTtf from '../assets/icons/ttf.svg'
import IconTxt from '../assets/icons/txt.svg'
import IconWav from '../assets/icons/wav.svg'
import IconXml from '../assets/icons/xml.svg'
import IconZip from '../assets/icons/zip.svg'
import IconLink12 from '../assets/icons/link-12.svg'

const FileIcon = ({ type }) => {
  // if type is defined as a relative path to the icon, convert it to icon "id"
  const typeAsPath = type && type.match(/(?:\.\.\/)+assets\/icons\/([^.]+)\.svg/)
  if (typeAsPath) {
    type = typeAsPath[1]
  }

  switch(type){
  case 'aac':
    return <IconAac className="icon-aac"/>
  case 'ai':
    return <IconAi className="icon-ai"/>
  case 'ase':
    return <IconAse className="icon-ase"/>
  case 'asp':
    return <IconAsp className="icon-asp"/>
  case 'aspx':
    return <IconAspx className="icon-aspx"/>
  case 'avi':
    return <IconAvi className="icon-avi"/>
  case 'bmp':
    return <IconBmp className="icon-bmp"/>
  case 'c++':
    return <IconCpp className="icon-c++"/>
  case 'cad':
    return <IconCad className="icon-cad"/>
  case 'cfm':
    return <IconCfm className="icon-cfm"/>
  case 'cgi':
    return <IconCgi className="icon-cgi"/>
  case 'csh':
    return <IconCsh className="icon-csh"/>
  case 'css':
    return <IconCss className="icon-css"/>
  case 'csv':
    return <IconCsv className="icon-csv"/>
  case 'dmg':
    return <IconDmg className="icon-dmg"/>
  case 'doc':
    return <IconDoc className="icon-doc"/>
  case 'docx':
    return <IconDocx className="icon-docx"/>
  case 'eps':
    return <IconEps className="icon-eps"/>
  case 'epub':
    return <IconEpub className="icon-epub"/>
  case 'exe':
    return <IconExe className="icon-exe"/>
  case 'flash':
    return <IconFlash className="icon-flash"/>
  case 'flv':
    return <IconFlv className="icon-flv"/>
  case 'font':
    return <IconFont className="icon-font"/>
  case 'gif':
    return <IconGif className="icon-gif"/>
  case 'gpx':
    return <IconGpx className="icon-gpx"/>
  case 'gzip':
    return <IconGzip className="icon-gzip"/>
  case 'html':
    return <IconHtml className="icon-html"/>
  case 'ics':
    return <IconIcs className="icon-ics"/>
  case 'iso':
    return <IconIso className="icon-iso"/>
  case 'jar':
    return <IconJar className="icon-jar"/>
  case 'java':
    return <IconJava className="icon-java"/>
  case 'jpg':
    return <IconJpg className="icon-jpg"/>
  case 'js':
    return <IconJs className="icon-js"/>
  case 'jsp':
    return <IconJsp className="icon-jsp"/>
  case 'log':
    return <IconLog className="icon-log"/>
  case 'max':
    return <IconMax className="icon-max"/>
  case 'md':
    return <IconMd className="icon-md"/>
  case 'mkv':
    return <IconMkv className="icon-mkv"/>
  case 'mov':
    return <IconMov className="icon-mov"/>
  case 'mp3':
    return <IconMp3 className="icon-mp3"/>
  case 'mp4':
    return <IconMp4 className="icon-mp4"/>
  case 'mpg':
    return <IconMpg className="icon-mpg"/>
  case 'obj':
    return <IconObj className="icon-obj"/>
  case 'otf':
    return <IconOtf className="icon-otf"/>
  case 'pdf':
    return <IconPdf className="icon-pdf"/>
  case 'php':
    return <IconPhp className="icon-php"/>
  case 'png':
    return <IconPng className="icon-png"/>
  case 'pptx':
    return <IconPptx className="icon-pptx"/>
  case 'psd':
    return <IconPsd className="icon-psd"/>
  case 'py':
    return <IconPy className="icon-py"/>
  case 'rar':
    return <IconRar className="icon-rar"/>
  case 'raw':
    return <IconRaw className="icon-raw"/>
  case 'rb':
    return <IconRb className="icon-rb"/>
  case 'rss':
    return <IconRss className="icon-rss"/>
  case 'rtf':
    return <IconRtf className="icon-rtf"/>
  case 'sketch':
    return <IconSketch className="icon-sketch"/>
  case 'sql':
    return <IconSql className="icon-sql"/>
  case 'srt':
    return <IconSrt className="icon-srt"/>
  case 'svg':
    return <IconSvg className="icon-svg"/>
  case 'tif':
    return <IconTif className="icon-tif"/>
  case 'tiff':
    return <IconTiff className="icon-tiff"/>
  case 'ttf':
    return <IconTtf className="icon-ttf"/>
  case 'txt':
    return <IconTxt className="icon-txt"/>
  case 'wav':
    return <IconWav className="icon-wav"/>
  case 'xml':
    return <IconXml className="icon-xml"/>
  case 'zip':
    return <IconZip className="icon-zip"/>
  case 'link-12':
    return <IconLink12 className="icon-link-12"/>
  default:
    // this will be default icon
    return <IconDefault className="icon-default"/>
  }
}

FileIcon.propTypes = {
  type: PT.string,
}

export default FileIcon
