import React from 'react';
import ScriptTag from 'react-script-tag';

export default function Playgame() {
    return (
        <>
        <div className="container-fluid">
            <div className="row">
                <div className="col" id="m1">-</div>
                <div className="col" id="m2">-</div>
                <div className="col" id="m3">-</div>
            </div>
            <div className="row">
                <div className="col" id="m4">-</div>
                <div className="col" id="m5">-</div>
                <div className="col" id="m6">-</div>
            </div>
            <div className="row">
                <div className="col" id="m7">-</div>
                <div className="col" id="m8">-</div>
                <div className="col" id="m9">-</div>
            </div>

            <ScriptTag src="/public/tttserver.js"></ScriptTag>
        </div>
        <div className="logscontainergame">
            <span id="loggame"></span>
        </div>
        </>
    )
}
