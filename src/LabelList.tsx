/* tslint:disable:object-literal-sort-keys no-console jsx-no-lambda jsx-no-bind curly ordered-imports*/

import * as React from "react";


const colorList = ["#69C666", "#F5DD2A", "#FFB031", "#F57259", "#D38EE4"];

interface IProps {
    updateLabel: any
}

class LabelList extends React.Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.state = {

        }
    }

    public render = () => (
        colorList.map(label => (
            <button 
                className={"label-btn"}
                key={"label-btn-" + label}
                onClick={(e: any) => {
                    this.props.updateLabel(label)
                    e.stopPropagation();
                }}
                style={{backgroundColor: label}}
            />
        ))
    )
}

export default LabelList;