// const kindWiseKey = `smcml7WqbTPg37RpcRmihN8GqTC6DituatMBapefBwVrjarvvx`;

export const KindwiseConfig = {
    apiURL: `https://plant.id/api/v3`,
    // healthApiKey: `Nh8Zq7J8P7h5F6lNwaep5QAsvl7HyLZiUZdb3dOKoBBYyFGIbH`,
    apiKey: `Nh8Zq7J8P7h5F6lNwaep5QAsvl7HyLZiUZdb3dOKoBBYyFGIbH`,
    healthURL: `https://plant.id/api/v3/health_assessment?details=local_name,description,url,treatment,classification,common_names,cause`

}



export const kindwiseHeaders = {
    'Api-Key': KindwiseConfig.apiKey,
    ' Content-Type': 'application / json',
    // 'Content - Length': 1263650
}