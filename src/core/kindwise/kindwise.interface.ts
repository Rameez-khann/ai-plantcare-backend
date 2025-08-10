//   "result": {
//     "is_plant": {
//       "probability": 0.47637302,
//       "binary": false,
//       "threshold": 0.5
//     },
//     "classification": {
//       "suggestions": [
//         {
//           "id": "ae8faed4a61d9de2",
//           "name": "Leucojum vernum",
//           "probability": 0.9998723,
//           "similar_images": [
//             {
//               "id": "587aeca4494253948c702d8356b4bebc2557a63d",
//               "url": "https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/3/587/aeca4494253948c702d8356b4bebc2557a63d.jpg",
//               "license_name": "CC0",
//               "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
//               "citation": "hen_ry",
//               "similarity": 0.683,
//               "url_small": "https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/3/587/aeca4494253948c702d8356b4bebc2557a63d.small.jpg"
//             },
//             {
//               "id": "dffa4fc0912feefa1516df8c20c080286556269f",
//               "url": "https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/3/dff/a4fc0912feefa1516df8c20c080286556269f.jpeg",
//               "similarity": 0.543,
//               "url_small": "https://plant-id.ams3.cdn.digitaloceanspaces.com/similar_images/3/dff/a4fc0912feefa1516df8c20c080286556269f.small.jpeg"
//             }
//           ],
//           "details": {
//             "language": "en",
//             "entity_id": "ae8faed4a61d9de2"
//           }
//         }
//       ]

export interface KindwiseResult {
    is_plant: {
        probability: number,
        binary: boolean,
        threshold: number,
    }

    classification: {
        suggestions: {
            id: string,
            name: string,
            probability: number,
            similar_images: {
                id: string,
                url: string,
                similarity: number,
                url_small: string,
            }[]
        }[],

    }
}

export interface PlantSuggestion {
    id: string,
    name: string,
    probability: number,
    similarImages: string[],
}

export interface PlantIdentificationResult {
    isPlant: boolean,
    probability: number,
    classification: PlantSuggestion[],
}