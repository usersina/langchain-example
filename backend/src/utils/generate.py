import random
import string


def generate_random_string(length: int = 100):
    """
    Generate a random string of the given length.
    """
    # Get all the ASCII letters in lowercase and uppercase
    letters = string.ascii_letters
    # Randomly choose characters from letters for the given length of the string
    random_string = "".join(random.choice(letters) for i in range(length))
    return random_string
