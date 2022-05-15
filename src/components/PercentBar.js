function PercentBar(props) {
    return (
        <div className='percentBarContainer'>
                <div className='percentBar' style={{'--barHeight': props.height}}></div>
        </div>
    );
}
export default PercentBar;