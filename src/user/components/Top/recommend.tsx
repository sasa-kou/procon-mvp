import React, { useState } from 'react'
import SystemCard from './SystemCard'
import { fireStore, popularPageIndex } from '../../../firebase/firebase'
import { rankingType } from '../../../types/type'
import Indicator from '../indicator'
import { Link } from 'react-router-dom'
import "../../../scss/popularSystemList.scss"


const getNowYMD = () => {
    const dt = new Date();
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    const result = y + "-" + m + "-" + d;
    return result;
};

const compare = (a: rankingType, b: rankingType) => {
    if (a.count > b.count) {
        return -1;
    } else {
        return 1;
    }
};
type fireStorePopularSystemType = {
    ranking: rankingType[];
};

const Recommend: React.FC = () => {
    const [recommendData, setrecommendData] = useState<rankingType[]>([
        
    ]);

    const isLoaded = () => {
        if (recommendData.length !== 0) {
            return true;
        } else {
            return false;
        }
    };

    if (recommendData.length === 0) {
        //一度だけfetch
        fireStore
            .collection(popularPageIndex)
            .doc(getNowYMD())
            .get()
            .then(doc => {
                if (doc.exists) {
                    const ranking = doc.data() as fireStorePopularSystemType;
                    const sortedRanking = ranking.ranking.sort(compare);
                    console.log(sortedRanking)
                    setrecommendData(sortedRanking.slice(0, 3));
                } else {
                    console.error("fetch failed");
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    
    return isLoaded() ? (
        <div className="popularSystemList">
            <ul>
                {recommendData.map(data => (
                    <SystemCard key={data.system.Name} system={data.system} />
                ))}
            </ul>
            <Link to="/">さらに詳しく</Link>
        </div>
    ) : (
            <Indicator />
        );
};

export default Recommend