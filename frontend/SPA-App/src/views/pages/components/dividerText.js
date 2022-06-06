import React from "react"

export const DividerText = props => {
    return (
        <div className="divider mt-2">
            <div className="divider-text font-medium-2">{props.title}</div>
        </div>
    )
}