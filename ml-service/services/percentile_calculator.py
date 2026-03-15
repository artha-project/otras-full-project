def calculate_percentile(scores):
    # Convert iterable to list so that it is 'Sized' (required for len())
    # and to ensure it can be iterated over multiple times (for sum and len).
    scores_list = list(scores)
    
    if not scores_list:
        return 0.0

    avg = sum(scores_list) / len(scores_list)

    # Note: (avg/100)*100 is just avg, but kept for consistency with original logic
    percentile = (avg / 100) * 100

    return percentile
