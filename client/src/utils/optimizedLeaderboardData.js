import {
  fetchOptimizedUserData,
  fetchBatchUserData,
  processUserDataResponse
} from '../api/OptimizedFetchData'

// Legacy function for backward compatibility - now uses optimized backend
export const fetchDataForLeetcoder = async (leetcoder) => {
  if (!leetcoder.userName || leetcoder.userName.trim() === '') {
    console.log(`No userName provided for leetcoder with ID: ${leetcoder.id}`)
    return leetcoder
  }

  try {
    const backendData = await fetchOptimizedUserData(leetcoder.userName)
    return processUserDataResponse(leetcoder, backendData)
  } catch (error) {
    console.error('Error fetching data for user:', leetcoder.userName, error)
    return leetcoder
  }
}

// New optimized function for batch processing
export const fetchDataForMultipleLeetcoders = async (leetcoders) => {
  const validLeetcoders = leetcoders.filter(
    leetcoder => leetcoder.userName && leetcoder.userName.trim() !== ''
  )

  if (validLeetcoders.length === 0) {
    return []
  }

  try {
    // Process in batches of 10 (backend limit)
    const batchSize = 10
    const batches = []
    
    for (let i = 0; i < validLeetcoders.length; i += batchSize) {
      batches.push(validLeetcoders.slice(i, i + batchSize))
    }

    const allResults = []

    for (const batch of batches) {
      try {
        const usernames = batch.map(user => user.userName.toLowerCase())
        const batchResults = await fetchBatchUserData(usernames)
        
        // Process each result
        const processedBatch = batch.map((leetcoder, index) => {
          const backendData = batchResults[index]
          if (backendData && backendData.success && backendData.data) {
            return processUserDataResponse(leetcoder, backendData.data)
          } else {
            console.warn(`Failed to fetch data for ${leetcoder.userName}`)
            return leetcoder
          }
        })

        allResults.push(...processedBatch)
      } catch (error) {
        console.error('Error processing batch:', error)
        // Fallback to individual processing for this batch
        const fallbackResults = await Promise.all(
          batch.map(leetcoder => fetchDataForLeetcoder(leetcoder))
        )
        allResults.push(...fallbackResults)
      }
    }

    return allResults
  } catch (error) {
    console.error('Error in batch processing, falling back to individual requests:', error)
    // Fallback to processing each user individually
    return Promise.all(
      validLeetcoders.map(leetcoder => fetchDataForLeetcoder(leetcoder))
    )
  }
}

// Function to fetch data with progress tracking
export const fetchDataWithProgress = async (leetcoders, onProgress) => {
  const validLeetcoders = leetcoders.filter(
    leetcoder => leetcoder.userName && leetcoder.userName.trim() !== ''
  )

  if (validLeetcoders.length === 0) {
    return []
  }

  const batchSize = 10
  const batches = []
  
  for (let i = 0; i < validLeetcoders.length; i += batchSize) {
    batches.push(validLeetcoders.slice(i, i + batchSize))
  }

  const allResults = []
  let completedUsers = 0

  for (const batch of batches) {
    try {
      // Update progress with current batch
      const batchUsernames = batch.map(user => user.userName).join(', ')
      onProgress && onProgress({
        progress: (completedUsers / validLeetcoders.length) * 100,
        currentlyProcessing: `Processing: ${batchUsernames}`
      })

      const usernames = batch.map(user => user.userName.toLowerCase())
      const batchResults = await fetchBatchUserData(usernames)
      
      // Process each result
      const processedBatch = batch.map((leetcoder, index) => {
        const backendData = batchResults[index]
        if (backendData && backendData.success && backendData.data) {
          return processUserDataResponse(leetcoder, backendData.data)
        } else {
          console.warn(`Failed to fetch data for ${leetcoder.userName}`)
          return leetcoder
        }
      })

      allResults.push(...processedBatch)
      completedUsers += batch.length

      // Update progress
      onProgress && onProgress({
        progress: (completedUsers / validLeetcoders.length) * 100,
        currentlyProcessing: `Completed: ${completedUsers}/${validLeetcoders.length}`
      })

    } catch (error) {
      console.error('Error processing batch:', error)
      // Fallback to individual processing for this batch
      for (const leetcoder of batch) {
        try {
          onProgress && onProgress({
            progress: (completedUsers / validLeetcoders.length) * 100,
            currentlyProcessing: `Processing: ${leetcoder.userName}`
          })

          const result = await fetchDataForLeetcoder(leetcoder)
          allResults.push(result)
          completedUsers++
        } catch (individualError) {
          console.error(`Error processing ${leetcoder.userName}:`, individualError)
          allResults.push(leetcoder)
          completedUsers++
        }
      }
    }
  }

  onProgress && onProgress({
    progress: 100,
    currentlyProcessing: 'Complete!'
  })

  return allResults
}
