import React, { PropTypes as PT } from 'react'
import config from '../../../config/projectWizard'
import ProductCard from './ProductCard'
import SVGIconImage from '../../../components/SVGIconImage'
import './SelectProduct.scss'

function SelectProduct(props) {
  const cards = []
  for (const key in config) {
    const type = config[key]
    const subTypes = type.subtypes
    for(const subType in subTypes) {
      const item = subTypes[subType]
      // don't render disabled items for selection
      if (item.disabled) continue
      const icon = <SVGIconImage filePath={item.icon} />
      cards.push(
        <ProductCard
          icon={icon}
          info={item.details}
          key={item.id}
          onClick={() => props.onProductChange(type.id, item.id)}
          type={ subType }
        />
      )
    }
  }
  return (
    <div className="SelectProduct">
      <div className="connect-logo"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAmCAYAAAB3c5OxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1REM4MEQyNkNFOTExRTdCNTQzQTZBN0JGNEI5QkZFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1REM4MEQzNkNFOTExRTdCNTQzQTZBN0JGNEI5QkZFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzVEQzgwRDA2Q0U5MTFFN0I1NDNBNkE3QkY0QjlCRkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzVEQzgwRDE2Q0U5MTFFN0I1NDNBNkE3QkY0QjlCRkUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7PBPehAAAHhUlEQVR42uxZCUxURxj+Ry6jCHihEdBK1IDLcriL6HLIadXiFYgYTSqKqRcICl5UxLMtR12C4lGv2EiMBwQUqZriLRbERVC0JUhVDgHxWhE8M50Z47q7PN5bCpqa7p9Mljfvf//838x/DghjDP83Qp8T9Pnzl3BRkQIqKirh4cOH0NzcAiYmJmBhYQGDBtmAg8NwGDlSCgMHWqMvHvTOnXvx6dN58OLFC534XVycYNq0ILYJRkaG6IsCffhwJj548Ai0tLT8q+/d3UdDXNyKLwP0gwf1ODFxM9y+/VeHZVHTX7kyGkQi+0479U4HfePGLbxpUwI8ffqs02QSsLBkSQR4erp3CvBOBV1UVIw3bvwJXr581enW06VLF4iJiSLAZR0Gzgv61q0/8ZUrhXDnTiU8evQIXr9+AwghMDU1JWZnBv369QNrayvw8/MGQ0MjUCqV5KRvQmnpTSguLoGGhocdBmtp2RecnZ3A0dEBxGIRmJubwdu37yAv7wxUV9dCfX09sSolNDU1AcVibGwEvXv3hiFDbGHUqJEwdOiQD9aCeEE3NTXjlJStcOlSvqBSFPDMmSHE/FawzRCJhoNE4swicF1dPRQUXGVy7t2r0hkoSVng4SEDNzdXsrGWcP16KSgUJVBWdguePVNCSkoi7N+fDhcvXhaUReVERYUT3brxg96+fTfOzs4RFNi/fz+iQBKsWbMeyssrWvmhWOzAFpXJRrENOHv2PDmhc+xUtMnUtDv4+nqDj88YItcS8vP/IJt1hVnNu3fvNHjpqS9fvhTmz48gsoTT4OTJgbBgwVx+0CEh32K6o0K0aVM8idDlcODAQYFAZASurhLw9/chuVfETuj48Vy4e/ceK0oCAycwXy0puQFnzpyDa9euExN+yyszOjqSudOuXfsE9aQucejQr/ygAwODsdCiXl4ezKzDw5fAmzdv22G6NrBsWRQBOxCqqqrBxsYabt4sA7l8K6nSGnWW06dPb9i2LQUiIqKJXzfw8hoaGkJOzlF+0GFhC3FNTW2bQoyNjWHHjlTiBr/A1asK4WhJgp+bmxTGj/+amXy3bl1bRV+l8jkuLLwGtHIrLb2hE/C5c0OJrG6QmrqNl8/KagDs2bNNtaYhF5OTkxj4QI8fP5b5qBBgCpb6aUhIkGA9bWbWA/n7ewMdlZX3cGZmNosB2v6sThkZWaTE3QK06qO1fFtE8WikPy4mHx8vnlM2gqCgKYJ+TOtmuTyBmHIkam8DYWs7CMXELEbUfGkD0hY9efKUNjEkUH3DK08bDydokg+Rvb0dpwBvby+orX1Aczjn+x49TEmKWATJyT8gO7thHSoiSJBD69evRnFxK6Fv3z6cPNnZxyEgwJeZORdRHBSPIGhKs2bN5JyfOHECZGUd53xHi4G0tBQYNy6gU5sEd/dRKC1NztamLqNOtEApK7vN3IiLQkNb42gTtLOzGNHCQ51olWNubk58+ZrGfPfu3WHp0ghYuzYWWVr2+SS9MPX5RYu+QwkJG1kVqE65uSdZnOEqnIg/I51BUyKpBdGSTr26uXDhskZwkUpHkICSjsaO9fukjf/HwkSEdu9OQ8HBU1g9TonmdRMTYxZHPhDVOywslLuOF1qEBCIwMHjPJpG4QGFhEfu7Z08L0gBE4vj4WI1jJznb7nOAJ+kKJSf/CF99NYjV3KdO/a46bQMDA6Z3r14W3AdBPxAa5HTx/PmLcUvLS0xqbHzoUAZWKpswaUB8yHAnI+DVq9fTyW8YGVG6yOys0dzcQtLbMRwXtwE/f96Ew8OjcX5+Aeb7BukvBvWg9aD1oPWg9aD1oPWg/1P0oUo5cuQodnGRYF9ff/Z74kRuq6pm+vQZ2M1tNJZIXPG8eQtavU9MTMaOjs64svJv9u7+/So8bJgdpr8feM6ePc/msrOPqeb8/AJwRkamhjzKM3q0DHt5ebORlPSzxns+fS9fzmffeHh4sbVkMg/2nJv7G+NhTBUVd7CDgyMuKSllk1lZ2VgqddVYJC4uHoeGzlHNTZ0ahFNTt2Jt0HSR2bPDBEHLZO64sfEx5gOtUBRzlpO66EtHXV09W4vyq8+zTqK4+DrY2tqSDuZ9GzZ58iS0ZcsWDYsoKCiA4OBg1fOkSRPZnDaNGOEC5eXltLlv02+6du0KIpEDpKTIea2QXlZwkS768hEDXVNTQ/pVM60LATeNDqWqqop0LT1VzxYWPUkDX81xf20KsbGxkJCQwK5o26LVq78HYpK0a2tzc+RyOQQGTsJ0VFfXqvi49JVIJO0DTa9lnzx5rPHi5MlTGsoMHjwYGho+XrU2NjayOS6aMGEcEovFsHmznO8qGC1cuBDWrVtH2tE3nDxJSYmQk3MM0WFtPQCpXyNr65uXl9c+0HSX6B10fv4VBnTv3n14w4aNGoxjxoyB9PR01XNmZiZ4enrynqRCoRDoiecg+o+Aurq6dgVfXfTV5aRRYmICREZGgZOTCz5wIJ3tsjotXx6DrKysiC+KWRCRSqUwZ05om7clNjbWKCIiXFCBtWvjVTcg2jRjxkywtxdhOlatisXqViKkrz5Pa9E/AgwAj9ynf/HXS54AAAAASUVORK5CYII=" alt=""/></div>    
      <h1>Select your project type</h1>
      <div className="cards">{cards}</div>
      <div className="footer">
        Looking for something else? <a href="http://crowdsourcing.topcoder.com/piqued_by_crowdsourcing">Get in touch with us.</a>
      </div>
    </div>
  )
}

SelectProduct.propTypes = {
  onProductChange: PT.func.isRequired
}

export default SelectProduct
